// ── PROXY DE IA · Netlify Function ────────────────────────────────────────────
// Única pieza que conoce la llave de API. El navegador nunca la ve.
// Se despliega solo con el sitio: Netlify detecta esta carpeta automáticamente.
//
// Variables de entorno (Netlify → Site settings → Environment variables):
//   ANTHROPIC_API_KEY   → para proveedor "claude"
//   CLAUDE_MODELO       → opcional, por defecto claude-sonnet-4-6
//   AZURE_OPENAI_ENDPOINT / AZURE_OPENAI_KEY / AZURE_OPENAI_DEPLOYMENT → "azure"

const SISTEMA = (marca) => `Sos el Ecosistema de Aprendizaje de ${marca === "CEUTEC" ? "CEUTEC (Centro Universitario Tecnológico)" : "UNITEC (Universidad Tecnológica Centroamericana)"}, Honduras.

IDENTIDAD
Respondés como el Ecosistema de Aprendizaje institucional, nunca como "una IA genérica" ni como "un asistente". Hablás desde el marco pedagógico de la institución, con voz docente, cercana y precisa. Español de Honduras, registro profesional.

MARCO DE REFERENCIA
- Metodología 3Cs: Conectar → Construir → Contribuir.
- Metodología L2L (DIP): Deconstruir → Identificar → Practicar.
- Las 6 Comunalidades Humanas y su Retrato del Egresado vinculado:
  Propósito y Equilibrio → Líder con Propósito
  Individuos y Grupos → Colaborador Constructivo
  Historias y Señales → Comunicador Efectivo
  Imaginación y Creatividad → Innovador Creativo
  La Tierra y los Ecosistemas → Ciudadano Responsable
  Patrones y Principios → Solucionador Empático
- Niveles de logro institucionales: Emergente → En Evolución → Experto → En Expansión.
- Marcos complementarios: GRASPS para evaluación auténtica, 5Es para indagación.

REGLAS
1. Anclá cada respuesta en el marco anterior. Si algo cae fuera del Ecosistema, decilo con franqueza en lugar de inventar doctrina institucional.
2. Human in the Loop: tus salidas son borradores para que el docente valide, nunca decisiones finales.
3. Nunca pidas ni proceses datos personales de estudiantes.
4. Respondé en Markdown. Sé concreto y accionable: el docente tiene poco tiempo.
5. Ante dudas de política institucional de IA, remitir a la Política PG-IA-002 y al Consejo de IA (consejoIA@unitec.edu).`;

const MAX_MENSAJES = 12;
const MAX_CARACTERES = 8000;

export default async (req) => {
  const json = (obj, status = 200) =>
    new Response(JSON.stringify(obj), { status, headers: { "Content-Type": "application/json" } });

  if (req.method !== "POST") return json({ error: "Método no permitido" }, 405);

  let cuerpo;
  try { cuerpo = await req.json(); }
  catch { return json({ error: "Cuerpo inválido" }, 400); }

  const { proveedor = "claude", marca = "UNITEC", mensajes } = cuerpo;

  // Validación de entrada: evita que el proxy se use como pasarela abierta.
  if (!Array.isArray(mensajes) || mensajes.length === 0)
    return json({ error: "Faltan mensajes" }, 400);
  if (mensajes.length > MAX_MENSAJES)
    return json({ error: `Máximo ${MAX_MENSAJES} mensajes por consulta` }, 400);

  const limpios = mensajes.map(m => ({
    role: m.role === "assistant" ? "assistant" : "user",
    content: String(m.content ?? "").slice(0, MAX_CARACTERES),
  })).filter(m => m.content.trim());

  if (!limpios.length) return json({ error: "Mensajes vacíos" }, 400);

  try {
    const texto = proveedor === "azure"
      ? await llamarAzure(limpios, marca)
      : await llamarClaude(limpios, marca);
    return json({ texto, proveedor });
  } catch (e) {
    console.error("[ia] fallo:", e);
    return json({ error: e.message || "Error del proveedor de IA" }, 502);
  }
};

// ── Anthropic ────────────────────────────────────────────────────────────────
async function llamarClaude(mensajes, marca) {
  const llave = process.env.ANTHROPIC_API_KEY;
  if (!llave) throw new Error("Falta configurar ANTHROPIC_API_KEY en el servidor");

  const r = await fetch("https://api.anthropic.com/v1/messages", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      "x-api-key": llave,
      "anthropic-version": "2023-06-01",
    },
    body: JSON.stringify({
      model: process.env.CLAUDE_MODELO || "claude-sonnet-4-6",
      max_tokens: 1500,
      system: SISTEMA(marca),
      messages: mensajes,
    }),
  });

  if (!r.ok) {
    const d = await r.text();
    throw new Error(`Anthropic ${r.status}: ${d.slice(0, 200)}`);
  }
  const d = await r.json();
  return d.content.filter(b => b.type === "text").map(b => b.text).join("\n");
}

// ── Azure OpenAI ─────────────────────────────────────────────────────────────
// Ruta institucional Microsoft. Ver nota sobre MS Copilot en el README.
async function llamarAzure(mensajes, marca) {
  const { AZURE_OPENAI_ENDPOINT: base, AZURE_OPENAI_KEY: llave,
          AZURE_OPENAI_DEPLOYMENT: despliegue } = process.env;
  if (!base || !llave || !despliegue)
    throw new Error("Falta configurar AZURE_OPENAI_ENDPOINT, AZURE_OPENAI_KEY o AZURE_OPENAI_DEPLOYMENT");

  const url = `${base.replace(/\/$/, "")}/openai/deployments/${despliegue}/chat/completions?api-version=2024-10-21`;
  const r = await fetch(url, {
    method: "POST",
    headers: { "Content-Type": "application/json", "api-key": llave },
    body: JSON.stringify({
      max_tokens: 1500,
      messages: [{ role: "system", content: SISTEMA(marca) }, ...mensajes],
    }),
  });

  if (!r.ok) {
    const d = await r.text();
    throw new Error(`Azure ${r.status}: ${d.slice(0, 200)}`);
  }
  const d = await r.json();
  return d.choices?.[0]?.message?.content || "";
}

export const config = { path: "/api/ia" };
