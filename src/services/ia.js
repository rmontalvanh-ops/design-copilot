// ── SERVICIO DE IA ────────────────────────────────────────────────────────────
// Misma firma que antes: consultarIA(msgs, marca). Lo que cambió con la capa
// de acceso institucional:
//   - Ya NO se envía "proveedor" en el body — el servidor lo decide solo,
//     vía IA_PROVEEDOR (ver netlify/functions/ia.js). El cliente nunca elige.
//   - VITE_IA_MODO ahora solo distingue "mock" (sin red, para desarrollo) de
//     cualquier otro valor = "real" (llamar a /api/ia de verdad). Ya NO
//     codifica qué proveedor usar — eso dejó de ser una decisión del navegador.
//   - credentials:"same-origin" explícito, para que la cookie de sesión de
//     Netlify Identity (nf_jwt) viaje con la solicitud — la Function la
//     necesita para el chequeo de autenticación.

const ENDPOINT = import.meta.env.VITE_IA_ENDPOINT || "/api/ia";
const MODO     = import.meta.env.VITE_IA_MODO     || "mock";   // mock | real

/** Respuesta simulada. Se mantiene para desarrollar sin gastar tokens ni backend. */
async function respuestaSimulada(msgs, marca) {
  await new Promise(r => setTimeout(r, 1300));
  const q = msgs[msgs.length - 1]?.content || "";
  return `**Ecosistema de Aprendizaje ${marca}**\n\nEn relación a: *"${q.slice(0,60)}..."*\n\nDesde el marco del Ecosistema, la secuencia **CCC** (Conectar → Construir → Contribuir) y el modelo **L2L** (DIP: Deconstruir → Identificar → Practicar) son los dos enfoques principales. Su diferencia clave: CCC enfoca la construcción colaborativa y la contribución comunitaria, mientras que L2L prioriza la metacognición y la autorregulación del estudiante.\n\nLas **6 Comunalidades Humanas** actúan como hilo conductor en ambos enfoques.\n\n> 🔗 Fuente: Ecosistema de Aprendizaje institucional\n\n_(Respuesta simulada · VITE_IA_MODO=mock)_`;
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
      credentials: "same-origin", // necesario para que viaje la cookie de sesión (nf_jwt)
      signal: opts.señal,
      body: JSON.stringify({
        marca,
        // Datos mínimos (PG-IA-002): se envía solo rol y contenido, nada de
        // identificadores del docente, del grupo ni de estudiantes.
        // NOTA: ya no se envía "proveedor" — el servidor lo decide solo.
        mensajes: msgs.slice(-12).map(m => ({ role: m.role, content: String(m.content).slice(0, 8000) })),
      }),
    });

    if (r.status === 401) {
      throw new Error("Tu sesión expiró o no iniciaste sesión. Recargá la página para volver a entrar.");
    }
    if (r.status === 403) {
      throw new Error("Tu cuenta no tiene permiso para usar el asistente de IA. Contactá al administrador del piloto.");
    }
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
