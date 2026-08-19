// ── MEMORIA ───────────────────────────────────────────────────────────────────
export const mem = {};
export const mGet = (k) => { try { return JSON.parse(mem[k]||"null"); } catch { return null; } };
export const mSet = (k,v) => { try { mem[k]=JSON.stringify(v); } catch {} };
export function guardarHist(tab, carrera, prompt) {
  const items = mGet("hist")||[];
  const slug  = carrera.replace(/[^a-zA-Z0-9]/g,"_").slice(0,20)||tab;
  const fecha = new Date().toLocaleDateString("es-HN",{day:"2-digit",month:"short",hour:"2-digit",minute:"2-digit"});
  mSet("hist", [{id:Date.now(),tab,carrera,slug,fecha,preview:prompt.replace(/[#*`\[\]\n═─]/g," ").replace(/\s+/g," ").trim().slice(0,110),prompt},...items].slice(0,12));
}
