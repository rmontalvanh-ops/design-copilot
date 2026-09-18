// ── LECTOR DE ARCHIVOS ────────────────────────────────────────────────────────
// Extrae texto de un .pdf o .docx directamente en el navegador — el archivo
// nunca sale del equipo del usuario. Mantiene la garantía de privacidad que
// ya declara la pestaña de auditoría ("sin enviar nada a ningún servidor").
//
// Las librerías son pesadas (pdf.js trae su propio worker), así que se
// importan de forma dinámica y solo cuando el usuario efectivamente sube un
// archivo — no inflan el bundle inicial de la app para quien nunca las usa.

/** @returns {Promise<string>} */
async function extraerDePDF(archivo) {
  const pdfjsLib = await import("pdfjs-dist/legacy/build/pdf.mjs");
  const workerUrl = (await import("pdfjs-dist/legacy/build/pdf.worker.mjs?url")).default;
  pdfjsLib.GlobalWorkerOptions.workerSrc = workerUrl;

  const buffer = await archivo.arrayBuffer();
  const doc = await pdfjsLib.getDocument({ data: buffer }).promise;
  const paginas = [];
  for (let i = 1; i <= doc.numPages; i++) {
    const pagina = await doc.getPage(i);
    const contenido = await pagina.getTextContent();
    // Preserva saltos de línea aproximados: pdf.js entrega ítems de texto
    // sueltos, sin estructura de párrafo — sin esto, todo el PDF llega como
    // una sola línea gigante y el motor de reglas no puede aislar secciones.
    paginas.push(contenido.items.map(it => it.str).join(" "));
  }
  return paginas.join("\n\n");
}

/** @returns {Promise<string>} */
async function extraerDeDOCX(archivo) {
  const mammoth = await import("mammoth/mammoth.browser");
  const buffer = await archivo.arrayBuffer();
  const { value } = await mammoth.extractRawText({ arrayBuffer: buffer });
  return value;
}

/**
 * Detecta el tipo por extensión y despacha al extractor correcto.
 * @returns {Promise<string>} texto plano listo para auditarPlanner()
 */
export async function extraerTexto(archivo) {
  const nombre = archivo.name.toLowerCase();
  if (nombre.endsWith(".pdf")) return extraerDePDF(archivo);
  if (nombre.endsWith(".docx")) return extraerDeDOCX(archivo);
  if (nombre.endsWith(".doc")) {
    throw new Error("El formato .doc antiguo no se puede leer en el navegador — guardá el archivo como .docx desde Word (Archivo → Guardar como) y subilo de nuevo.");
  }
  if (nombre.endsWith(".txt") || nombre.endsWith(".md")) return archivo.text();
  throw new Error("Formato no soportado — subí un .pdf, .docx, .txt o .md.");
}
