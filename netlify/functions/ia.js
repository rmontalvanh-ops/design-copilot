// ── PROXY DE IA · Netlify Function ────────────────────────────────────────────
// Única pieza que conoce la llave de API y el proveedor. El navegador nunca ve
// ninguna de las dos cosas. Se despliega solo con el sitio: Netlify detecta
// esta carpeta automáticamente.
//
// CAPA INSTITUCIONAL DE ACCESO (piloto) — orden real de la solicitud:
//   1. Netlify aplica `config.rateLimit` a nivel de plataforma/edge, ANTES de
//      que este código llegue a ejecutarse — no es un chequeo dentro del
//      handler, es una puerta previa que Netlify impone sola.
//   2. Dentro del handler: método → autenticación → autorización (rol) →
//      validación de payload → validación de marca → proveedor (server-side,
//      fijo por env) → LLM → respuesta saneada.
//
// Variables de entorno (Netlify → Site settings → Environment variables):
//   IA_PROVEEDOR         → "claude" | "azure" — el ÚNICO lugar que decide el
//                          proveedor. El cliente ya no puede elegirlo.
//   ANTHROPIC_API_KEY    → para proveedor "claude"
//   CLAUDE_MODELO        → opcional, por defecto claude-sonnet-4-6
//   AZURE_OPENAI_ENDPOINT / AZURE_OPENAI_KEY / AZURE_OPENAI_DEPLOYMENT → "azure"
//
// VERIFICADO contra la documentación pública del paquete (npm, sección de
// ejemplos): la firma correcta en contexto de Function es `getUser()` SIN
// argumentos — el paquete resuelve el contexto de la solicitud internamente.
// (Corrección: una primera versión de este archivo pasaba `getUser(req)`,
// que no es la firma documentada.)
import { getUser } from "@netlify/identity";

// M5 — catálogo cerrado de metodologías (CCC/DIP/CAR + el catálogo B/I/A)
// vigente — sujeto a reemplazo si el Comité de Ecosistema de Aprendizaje
// aprueba FO-AD-003 punto 2 ("Enfoque Pedagógico y Orientaciones
// Metodológicas"). No cambiar este comportamiento hasta que exista esa
// aprobación. Nota interna — nunca visible al docente.
const SISTEMA = (marca) => `Sos el Ecosistema de Aprendizaje de ${marca === "CEUTEC" ? "CEUTEC (Centro Universitario Tecnológico)" : "UNITEC (Universidad Tecnológica Centroamericana)"}, Honduras.

IDENTIDAD
Respondés como el Ecosistema de Aprendizaje institucional, nunca como "una IA genérica" ni como "un asistente". Sos un colega estratégico, un mentor empático y un colíder de codiseño curricular — guiás, no fiscalizás. El docente es tu colaborador y quien valida cada decisión. Español de Honduras, registro profesional y cercano.

MARCO DE REFERENCIA
- Secuencias por tipo de meta: CCC (Conectar→Construir→Contribuir) para Conceptual, DIP (Deconstruir→Identificar→Practicar) para Competencia, CAR (Considerar→Actuar→Reflexionar) para Carácter.
- Las 6 Comunalidades Humanas y su Retrato del Egresado vinculado — 100% fijo, no elegible libremente:
  Propósito y Equilibrio → Líder con Propósito
  Individuos y Grupos → Colaborador Constructivo
  Historias y Señales → Comunicador Efectivo
  Imaginación y Creatividad → Innovador Creativo
  La Tierra y los Ecosistemas → Ciudadano Responsable
  Patrones y Principios → Solucionador Empático
- Niveles de logro institucionales: Emergente → En Evolución → Experto → En Expansión (este último exige contexto global o voces diversas).
- Fórmulas obligatorias, usar textualmente: Meta Conceptual "Los estudiantes comprenden que...", Meta de Competencia "Los estudiantes son capaces de...", Meta de Carácter "Los estudiantes se convierten en...", Meta L2L "Los estudiantes desarrollan la capacidad de...".
- GRASPS: 2 o 3 opciones de producto, nunca una sola. No-GRASPS: transformar las actividades del sílabo con técnicas del catálogo del Ecosistema (CC BY-NC-ND, Common Ground Collaborative), no inventar dinámicas nuevas.
- Continuo L2L: Transaccional → Transicional → Transformacional → Trascendente, con feedback S.T.A.R.

PRECISIÓN TERMINOLÓGICA (FO-AD-003) — usar estas palabras con este sentido exacto, nunca como sinónimos entre sí:
  · Metodología: marco general que organiza el aprendizaje (ej. Aprendizaje Basado en Problemas).
  · Estrategia: mecanismo específico dentro de una metodología (ej. debate, juego de roles).
  · Actividad: acción concreta del estudiante (ej. resolver un caso, construir un prototipo).
  · Evidencia: producto o desempeño observable que demuestra aprendizaje.
  · Instrumento: herramienta para valorar una evidencia (rúbrica, lista de cotejo, guía de observación).

PRINCIPIOS DEL ECOSISTEMA (FO-AD-003, Sección 02):
  1. Las metodologías son medios; las competencias son el propósito; las evidencias son la demostración.
  2. No deben existir competencias sin evidencias, evidencias sin competencias, ni capacidades humanas sin manifestación observable.
  3. Una sola transformación de aprendizaje; múltiples caminos metodológicos según la modalidad.
  4. La modalidad modifica estrategias, recursos, mediación e interacciones — NO modifica competencias, capacidades humanas, conceptos ni evidencias finales.

GOBERNANZA DOCUMENTAL — el Planner NUNCA inventa ni redefine Capacidades Humanas: las hereda del sílabo. Si el docente no proporcionó el sílabo o no declaró qué Capacidades Humanas trae, pedíselo antes de asumir una — no elijas una capacidad "por criterio propio". Para sugerir metodología, evidencia o instrumento asociados a una Capacidad Humana ya declarada, usar únicamente afinidades con respaldo documental (Aula Invertida/Simulación/ABP para Líder con Propósito, Investigación Aplicada/A+S para Ciudadano Responsable, ABP/Casos/Pensamiento de Diseño para Solucionador de Problemas Empático, Pensamiento de Diseño/Prototipado para Innovador Creativo, Aprendizaje Cooperativo/TBL para Colaborador Constructivo, Enseñanza Recíproca/Debate para Comunicador Efectivo) — nunca inventar una afinidad sin respaldo.

MODALIDAD — pendiente de resolución institucional (FO-AD-003, agenda del Comité): hoy conviven "B-Learning" (vigente) y "Semipresencial"/"Teledocencia" (propuestos). Si el docente pregunta o el contexto lo requiere, aclarar que es una decisión todavía no cerrada por el Comité de Ecosistema de Aprendizaje — nunca presentarla como política ya vigente.

REGLAS
1. Anclá cada respuesta en el marco anterior. Si algo cae fuera del Ecosistema, decilo con franqueza en lugar de inventar doctrina institucional.
2. Ante resistencia u objeciones del docente, validá la preocupación con empatía y reformulá en micro-pasos de alto impacto — nunca insistas sin más.
3. Antes de proponer una tarea, considerá si es viable en el tiempo real de aula y evaluación del docente.
4. Human in the Loop: tus salidas son borradores para que el docente valide, nunca decisiones finales.
5. Nunca pidas ni proceses datos personales de estudiantes.
6. Respondé en Markdown. Sé concreto y accionable: el docente tiene poco tiempo.
7. Nunca uses la sigla "CGS" — el nombre siempre es Ecosistema de Aprendizaje.
8. Ante dudas de política institucional de IA, remitir a la Política PG-IA-002 y al Consejo de IA (consejoIA@unitec.edu).`;
// (Regla 8 corregida — antes duplicaba el número 5 por error de redacción.)

const MAX_MENSAJES = 12;
const MAX_CARACTERES = 8000;
const MARCAS_VALIDAS = ["UNITEC", "CEUTEC"];
const PROVEEDORES_VALIDOS = ["claude", "azure"];

/** Log estructurado, una línea por solicitud — nunca contenido pedagógico. */
function logOperacional(datos) {
  try { console.log(JSON.stringify({ ts: new Date().toISOString(), ...datos })); }
  catch { /* el logging nunca debe tumbar la respuesta al usuario */ }
}

/** Mensaje genérico y seguro — el detalle real solo queda en el log server-side. */
function errorSeguro(status, mensajePublico, detalleInterno) {
  if (detalleInterno) console.error("[ia] detalle interno:", detalleInterno);
  return new Response(JSON.stringify({ error: mensajePublico }), {
    status, headers: { "Content-Type": "application/json" },
  });
}

export default async (req) => {
  const inicio = Date.now();
  const json = (obj, status = 200) =>
    new Response(JSON.stringify(obj), { status, headers: { "Content-Type": "application/json" } });

  // 1 · MÉTODO ────────────────────────────────────────────────────────────────
  if (req.method !== "POST") return errorSeguro(405, "Método no permitido.");

  // 2 · AUTENTICACIÓN ──────────────────────────────────────────────────────────
  // Sin sesión válida, corte total antes de tocar cuerpo, proveedor o LLM.
  let usuario;
  try {
    usuario = await getUser();
  } catch (e) {
    // Un fallo del propio chequeo de identidad se trata como "no autenticado",
    // nunca como excepción no controlada que podría filtrar detalles.
    logOperacional({ evento: "auth_error", http_status: 401, duracion_ms: Date.now() - inicio });
    return errorSeguro(401, "No autorizado.", e);
  }
  if (!usuario) {
    logOperacional({ evento: "sin_sesion", http_status: 401, duracion_ms: Date.now() - inicio });
    return errorSeguro(401, "No autorizado.");
  }

  // 3 · AUTORIZACIÓN (rol) ─────────────────────────────────────────────────────
  const roles = usuario.app_metadata?.roles || [];
  if (!roles.includes("docente")) {
    logOperacional({ evento: "sin_rol_docente", usuario: usuario.email, http_status: 403, duracion_ms: Date.now() - inicio });
    return errorSeguro(403, "No tenés permiso para usar este recurso.");
  }

  // 4 · VALIDACIÓN DE PAYLOAD ──────────────────────────────────────────────────
  let cuerpo;
  try { cuerpo = await req.json(); }
  catch { return errorSeguro(400, "Cuerpo inválido."); }

  // El campo "proveedor" ya NO se lee del cliente en absoluto — ver punto 6.
  const { marca, mensajes } = cuerpo;

  if (!Array.isArray(mensajes) || mensajes.length === 0)
    return errorSeguro(400, "Faltan mensajes.");
  if (mensajes.length > MAX_MENSAJES)
    return errorSeguro(400, `Máximo ${MAX_MENSAJES} mensajes por consulta.`);

  const limpios = mensajes.map(m => ({
    role: m.role === "assistant" ? "assistant" : "user",
    content: String(m.content ?? "").slice(0, MAX_CARACTERES),
  })).filter(m => m.content.trim());

  if (!limpios.length) return errorSeguro(400, "Mensajes vacíos.");

  // 5 · VALIDACIÓN DE MARCA ────────────────────────────────────────────────────
  // Estricta: nunca cae en UNITEC por defecto ante un valor desconocido.
  if (!MARCAS_VALIDAS.includes(marca))
    return errorSeguro(400, "Marca inválida.");

  // 6 · PROVEEDOR — exclusivamente server-side ────────────────────────────────
  const proveedor = process.env.IA_PROVEEDOR;
  if (!PROVEEDORES_VALIDOS.includes(proveedor)) {
    // Error de configuración del servidor, nunca fallback silencioso.
    logOperacional({ evento: "proveedor_mal_configurado", usuario: usuario.email, marca, http_status: 500, duracion_ms: Date.now() - inicio });
    return errorSeguro(500, "El servicio de IA no está disponible temporalmente.", `IA_PROVEEDOR inválido o ausente: "${proveedor}"`);
  }

  // 7 · LLM + RESPUESTA SEGURA ─────────────────────────────────────────────────
  try {
    const texto = proveedor === "azure"
      ? await llamarAzure(limpios, marca)
      : await llamarClaude(limpios, marca);

    logOperacional({
      evento: "ok", usuario: usuario.email, marca, proveedor,
      n_mensajes: limpios.length,
      n_caracteres_aprox: limpios.reduce((s, m) => s + m.content.length, 0),
      http_status: 200, duracion_ms: Date.now() - inicio, error: null,
    });
    return json({ texto });

  } catch (e) {
    logOperacional({
      evento: "fallo_proveedor", usuario: usuario.email, marca, proveedor,
      http_status: 502, duracion_ms: Date.now() - inicio, error: String(e.message || e).slice(0, 200),
    });
    // Al cliente: genérico. El detalle real (status, cuerpo de Anthropic/Azure)
    // solo vive en el log de arriba — nunca sale de este servidor.
    return errorSeguro(502, "El servicio de IA no está disponible temporalmente.", e);
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
    // Este detalle SOLO se usa en el catch de arriba para el log — nunca llega
    // al cliente tal cual (el handler ya lo intercepta y sanea).
    throw new Error(`Anthropic ${r.status}: ${d.slice(0, 200)}`);
  }
  const d = await r.json();
  return d.content.filter(b => b.type === "text").map(b => b.text).join("\n");
}

// ── Azure OpenAI ─────────────────────────────────────────────────────────────
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

export const config = {
  path: "/api/ia",
  // Rate limiting nativo de Netlify — se aplica a nivel de plataforma, antes
  // de que este archivo se ejecute. No es una cuota por docente (ver punto 7
  // de la instrucción): protege contra ráfagas/abuso durante el piloto.
  rateLimit: { windowSize: 60, windowLimit: 20, aggregateBy: ["ip"] },
};
