// ── SERVICIO DE IA ────────────────────────────────────────────────────────────
// Reemplaza al mockAPI original. Misma firma: consultarIA(msgs, marca).
//
// IMPORTANTE — por qué esto no llama a Anthropic ni a Azure directamente:
// cualquier llave puesta en el código del frontend queda visible para quien abra
// las herramientas de desarrollo del navegador. Todas las llamadas pasan por la
// función serverless de netlify/functions/ia.js, que es donde vive la llave.

const ENDPOINT = import.meta.env.VITE_IA_ENDPOINT || "/api/ia";
const MODO     = import.meta.env.VITE_IA_MODO     || "mock";   // mock | claude | azure

/** Respuesta simulada. Se mantiene para desarrollar sin gastar tokens ni backend. */
async function respuestaSimulada(msgs, marca) {
  await new Promise(r => setTimeout(r, 1300));
  const q = msgs[msgs.length - 1]?.content || "";
  return `**Ecosistema de Aprendizaje ${marca}**\n\nEn relación a: *"${q.slice(0,60)}..."*\n\nDesde el marco del Ecosistema, el **modelo 3Cs** (Conectar → Construir → Contribuir) y el **modelo L2L** (DIP: Deconstruir → Identificar → Practicar) son las dos metodologías principales. Su diferencia clave: 3Cs enfoca la construcción colaborativa y la contribución comunitaria, mientras que L2L prioriza la metacognición y la autorregulación del estudiante.\n\nLas **6 Comunalidades Humanas** actúan como hilo conductor en ambas metodologías.\n\n> 🔗 Fuente: Unitec Planner · CGS Book v5\n\n_(Respuesta simulada · VITE_IA_MODO=mock)_`;
}

/**
 * Consulta al modelo. Devuelve texto en Markdown.
 * @param {Array<{role:string,content:string}>} msgs  historial de la conversación
 * @param {"UNITEC"|"CEUTEC"} marca
 * @param {{señal?:AbortSignal}} opts
 */
export async function consultarIA(msgs, marca, opts = {}) {
  if (MODO === "mock") return respuestaSimulada(msgs, marca);

  try {
    const r = await fetch(ENDPOINT, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      signal: opts.señal,
      body: JSON.stringify({
        proveedor: MODO,
        marca,
        // Datos mínimos (PG-IA-002): se envía solo rol y contenido, nada de
        // identificadores del docente, del grupo ni de estudiantes.
        mensajes: msgs.slice(-12).map(m => ({ role: m.role, content: String(m.content).slice(0, 8000) })),
      }),
    });

    if (!r.ok) {
      const d = await r.json().catch(() => ({}));
      throw new Error(d.error || `El servicio respondió ${r.status}`);
    }
    const d = await r.json();
    return d.texto;

  } catch (e) {
    if (e.name === "AbortError") throw e;
    console.error("[Design Co-Pilot] Error de IA:", e);
    return `⚠️ **No se pudo consultar la IA en este momento.**\n\n${e.message}\n\nRevisá tu conexión y volvé a intentar. Si el problema persiste, reportalo al Consejo de IA (consejoIA@unitec.edu) siguiendo el principio *"Si ves algo, dilo"* de la Política PG-IA-002.\n\nMientras tanto, podés seguir generando prompts: el resto de la suite funciona sin conexión a la IA.`;
  }
}
