// ── SPRINT H · MOTOR DE REGLAS DEL PLANNER ────────────────────────────────────
// Implementa las 12 reglas locales de ESTANDARES_PLANNER.md v2. Sin IA: solo
// coincidencia de texto y conteo, por eso corre instantáneo y sin costo.
//
// Cada regla: id, área del Chequeo de Calidad, enunciado, tip si falla,
// frecuencia observada en la Guía del Decano, y check(texto) → {cumple, nota}.
// "cumple" puede ser true / false / null — null significa "no se encontró la
// sección para evaluar" y se reporta distinto de un incumplimiento real.
//
// M5 — el catálogo cerrado de metodologías que estas reglas asumen (CCC/DIP/
// CAR) sigue vigente mientras el Comité de Ecosistema de Aprendizaje no
// apruebe el reemplazo por "Enfoque Pedagógico y Orientaciones Metodológicas"
// (FO-AD-003, punto 2). No cambiar el comportamiento todavía.

const VERBOS_ACCION = ["analizar","comparar","aplicar","relacionar","evaluar","diseñar",
  "identificar","clasificar","resolver","construir","elaborar","implementar"];

// Normaliza artefactos de tabla ASCII (bordes +---+ de tablas grid Markdown,
// pipes de columna) que aparecen al convertir un .docx con pandoc. Un Planner
// pegado directo desde Word no trae esto, pero normalizar no tiene costo y
// hace el motor robusto sin importar de dónde venga el texto pegado.
function aPlano(t) {
  return (t || "")
    .split("\n")
    .filter(l => !/^[\s+=\-]{6,}$/.test(l))
    .map(l => l.replace(/\|/g, " "))
    .join("\n")
    .replace(/[ \t]{2,}/g, " ")
    .replace(/\n{3,}/g, "\n\n");
}

// Aísla el texto que sigue a una etiqueta de sección, hasta ~600 caracteres
// después. Tolerante a Markdown (**, ##, *) alrededor del rótulo.
function seccion(texto, ...etiquetas) {
  for (const et of etiquetas) {
    const re = new RegExp(`[#*\\s]*${et}[#*:\\s-]*\\n?([\\s\\S]{0,600})`, "i");
    const m = texto.match(re);
    // Etiquetas con alternativas propias (p.ej. "(el )?") traen su propio
    // grupo de captura y corren el índice — el contenido real siempre queda
    // en el ÚLTIMO grupo capturado, no necesariamente en m[1].
    if (m) return m[m.length - 1];
  }
  return null;
}
function normaliza(s) {
  return (s || "").replace(/\*\*|\*|__|_/g, "").replace(/\s+/g, " ").trim();
}
function empiezaCon(s, ...prefijos) {
  const n = normaliza(s).toLowerCase();
  return prefijos.some(p => n.startsWith(p.toLowerCase()));
}
function contiene(s, ...frases) {
  const n = normaliza(s).toLowerCase();
  return frases.some(f => n.includes(f.toLowerCase()));
}

// La Gran Idea no tiene rótulo persistente: en la plantilla oficial, "Gran
// Idea" es el texto placeholder que el docente borra y reemplaza. Por eso no
// puede localizarse por etiqueta como las demás secciones — se localiza por
// posición: es el primer párrafo, antes de la tabla de identidad, que no es
// la Pregunta Detonante (la Pregunta siempre contiene "?").
function granIdea(plano) {
  const zona = plano.split(/\*\*Asignatura\*\*/i)[0];
  const parrafos = zona.split(/\n\s*\n/).map(p => p.trim())
    .filter(p => p.length > 20 && !p.startsWith("!["));
  if (parrafos.length < 2) return null; // no hay suficiente estructura para distinguir
  return parrafos.find(p => !p.includes("?")) || null;
}

export const REGLAS = [
  {
    id: "L1", area: "El Porqué", regla: 'La Gran Idea inicia con "Entender..." o "Entender que..."',
    frecuencia: "Casi todos", origen: "Capacitación M2",
    tip: 'Si la Gran Idea no arranca con "Entender que...", probablemente todavía se pensó pero no se escribió.',
    check(t) {
      const gi = granIdea(aPlano(t));
      if (gi == null) return { cumple: null };
      return { cumple: empiezaCon(gi, "Entender que", "Entender") };
    },
  },
  {
    id: "L2", area: "El Porqué", regla: 'La Historia para docentes cierra con "…Por eso este módulo importa."',
    frecuencia: ">50%", origen: "Plantilla oficial",
    tip: 'La plantilla trae el cierre preimpreso — si falta, probablemente se reescribió la Historia sin conservarlo.',
    check(t) {
      const s = seccion(t, "Historia para (el )?docente", "Historia \\(docente\\)");
      if (s == null) return { cumple: null };
      return { cumple: contiene(s, "por eso este módulo importa") };
    },
  },
  {
    id: "L3", area: "El Porqué", regla: "La Historia para estudiantes cierra con la misma frase",
    frecuencia: ">50%", origen: "Plantilla oficial",
    tip: "Igual que la Historia docente: el cierre debe repetirse literal.",
    check(t) {
      const s = seccion(t, "Historia para (el )?estudiante", "Historia \\(estudiante\\)");
      if (s == null) return { cumple: null };
      return { cumple: contiene(s, "por eso este módulo importa") };
    },
  },
  {
    id: "L4", area: "El Qué", regla: 'La Meta Conceptual inicia con "Los estudiantes comprenden que…"',
    frecuencia: ">50%", origen: "Capacitación M4",
    tip: 'Si falta el "que", la meta suele derivar en un sustantivo ("comprenden los fundamentos de...") en vez de una proposición evaluable.',
    check(t) {
      const s = seccion(t, "Meta Conceptual");
      if (s == null) return { cumple: null };
      return { cumple: empiezaCon(s, "Los estudiantes comprenden que") };
    },
  },
  {
    id: "L5", area: "El Qué", regla: "La Meta Conceptual no arranca con un verbo de acción",
    frecuencia: ">50% (mismo error que L4)", origen: "Guía del Decano",
    tip: "Si la meta empieza con un verbo como analizar o aplicar, es una competencia disfrazada de comprensión.",
    check(t) {
      const s = normaliza(seccion(t, "Meta Conceptual") || "").toLowerCase();
      if (!s) return { cumple: null };
      const sinPrefijo = s.replace(/^los estudiantes comprenden(\s+que)?/i, "").trim();
      const primeraPalabra = sinPrefijo.split(/\s+/)[0] || "";
      return { cumple: !VERBOS_ACCION.includes(primeraPalabra) };
    },
  },
  {
    id: "L6", area: "El Qué", regla: 'La Meta de Competencia inicia con "Los estudiantes son capaces de…"',
    frecuencia: "—", origen: "Plantilla + Capacitación M4",
    tip: 'La plantilla y la capacitación coinciden en "son", no "serán".',
    check(t) {
      const s = seccion(t, "Meta de Competencia");
      if (s == null) return { cumple: null };
      return { cumple: empiezaCon(s, "Los estudiantes son capaces de") };
    },
  },
  {
    id: "L7", area: "El Qué", regla: 'La Meta de Carácter usa "se convierten en…" o "se vuelven más…"',
    frecuencia: "2do más común", origen: "⚠️ Pendiente de decisión — D1",
    tip: "Ambas fórmulas están respaldadas por fuentes distintas hasta que el Decano resuelva cuál rige.",
    check(t) {
      const s = seccion(t, "Meta de(l)? Carácter");
      if (s == null) return { cumple: null };
      return { cumple: contiene(s, "se convierten en", "se vuelven más") };
    },
  },
  {
    id: "L8", area: "El Qué", regla: 'La Meta L2L usa "desarrollan la capacidad de…"',
    frecuencia: "—", origen: "Capacitación M4",
    tip: "Acepta también la variante progresiva 'están desarrollando la capacidad de'.",
    check(t) {
      const s = seccion(t, "(Meta|Objetivos?) (de )?(L2L|Aprendiendo a Aprender)");
      if (s == null) return { cumple: null };
      return { cumple: contiene(s, "desarrollan la capacidad de", "desarrollando la capacidad de") };
    },
  },
  {
    id: "L9", area: "La Evidencia", regla: "El GRASPS ofrece 2 o 3 opciones de producto, no una sola",
    frecuencia: "100% de Planners revisados", origen: "Chequeo de Calidad del Ecosistema",
    tip: "El único error con incidencia total en la muestra del Decano. Pregunta guía: ¿le doy al estudiante al menos 2 caminos para mostrar lo que aprendió?",
    check(t) {
      let s = seccion(t, "Producto");
      if (s == null) return { cumple: null };
      // Acotar antes del siguiente rótulo — si no, el conteo de viñetas
      // arrastra la lista de Criterios de Éxito que viene después.
      s = s.split(/criterios de éxito/i)[0];
      const viñetas = (s.match(/^\s*[-*•]\s+\S/gm) || []).length;
      const numeradas = (s.match(/^\s*\d+[.)]\s+\S/gm) || []).length;
      const opciones = Math.max(viñetas, numeradas);
      if (opciones >= 2) return { cumple: true, nota: `${opciones} opciones detectadas` };
      const separadores = (s.match(/\s(o|u)\s/gi) || []).length;
      return { cumple: separadores >= 1, nota: opciones + separadores === 0 ? "Parece un único producto" : undefined };
    },
  },
  {
    id: "L10", area: "El Cómo", regla: "Existen secuencias DIP y CAR además de CCC",
    frecuencia: ">50%", origen: "Guía del Decano",
    tip: "Detenerse solo en CCC (Conectar-Construir-Contribuir) es el error de mayor frecuencia junto al de la Gran Idea. Cada tipo de meta necesita su propia secuencia.",
    check(t) {
      const tieneDIP = contiene(t, "DIP", "Deconstruir");
      const tieneCAR = contiene(t, "CAR:", " CAR ", "Considerar, Actuar", "Considerar → Actuar");
      if (!contiene(t, "CCC", "Conectar")) return { cumple: null };
      return { cumple: tieneDIP && tieneCAR, nota: !tieneDIP && !tieneCAR ? "Solo se encontró CCC" : (!tieneDIP ? "Falta DIP" : !tieneCAR ? "Falta CAR" : undefined) };
    },
  },
  {
    id: "L11", area: "Consistencia", regla: "Las capacidades del Retrato coinciden entre la portada y la Meta del Carácter",
    frecuencia: "Hallazgo de revisión — no está en ninguna guía oficial", origen: "Revisión del Planner IR55421",
    tip: "Verificá que la lista de 'Enlaces al Retrato' de la portada sea exactamente la misma que aparece en la Meta del Carácter. Es el error más difícil de notar al llenar y el más fácil de detectar automáticamente.",
    check(t) {
      const s1 = seccion(t, "Enlaces al Retrato", "Retrato del Egresado");
      const s2 = seccion(t, "Meta de(l)? Carácter");
      if (s1 == null || s2 == null) return { cumple: null };
      // Regex tolerantes a plural español (Solucionador/Solucionadores,
      // empático/empáticos) — la Meta del Carácter suele redactar en plural
      // ("Se convierten en...") mientras el Retrato lista en singular.
      const CAPACIDADES = [
        { nombre: "Líder con Propósito", re: /l[ií]der(?:es)? con prop[oó]sito/i },
        { nombre: "Colaborador Constructivo", re: /colaborador(?:es)? constructivo(?:s)?/i },
        { nombre: "Comunicador Efectivo", re: /comunicador(?:es)? efectivo(?:s)?/i },
        { nombre: "Innovador Creativo", re: /innovador(?:es)? creativo(?:s)?/i },
        { nombre: "Ciudadano Responsable", re: /ciudadano(?:s)? responsable(?:s)?/i },
        { nombre: "Solucionador Empático / de Problemas Empático", re: /solucionador(?:es)?( de problemas)? emp[aá]tico(?:s)?/i },
      ];
      const listaEn = s => CAPACIDADES.filter(c => c.re.test(s)).map(c => c.nombre);
      const a = new Set(listaEn(s1)), b = new Set(listaEn(s2));
      if (a.size === 0 || b.size === 0) return { cumple: null };
      const iguales = a.size === b.size && [...a].every(c => b.has(c));
      const soloEnA = [...a].filter(c => !b.has(c));
      const soloEnB = [...b].filter(c => !a.has(c));
      return { cumple: iguales, nota: iguales ? undefined : `Difieren: portada tiene [${soloEnA.join(", ") || "—"}], Meta del Carácter tiene [${soloEnB.join(", ") || "—"}]` };
    },
  },
  {
    id: "L12", area: "La Evidencia", regla: "La Rúbrica trae descriptores propios de la tarea, no la plantilla vacía",
    frecuencia: "Ocasional", origen: "Guía del Decano",
    tip: "Si un descriptor podría copiarse a cualquier otra rúbrica sin cambiar una palabra, todavía no está personalizado.",
    check(t) {
      const s = seccion(t, "Rúbrica");
      if (s == null) return { cumple: null };
      const tieneNiveles = contiene(s, "Emergente") && contiene(s, "En Evolución") && contiene(s, "Experto") && contiene(s, "En Expansión");
      if (!tieneNiveles) return { cumple: null };
      const placeholder = /\[.*?\]|descripción del nivel|texto de ejemplo|lorem ipsum/i.test(s);
      return { cumple: !placeholder };
    },
  },
];

const NIVELES = [
  { min: 90, nombre: "En Expansión" },
  { min: 70, nombre: "Experto" },
  { min: 40, nombre: "En Evolución" },
  { min: 0,  nombre: "Emergente" },
];

/**
 * Corre las 12 reglas locales sobre un texto de Planner (Markdown o texto plano).
 * Reglas cuya sección no se encontró se excluyen del índice (no penalizan
 * ni favorecen), y se listan aparte como "no evaluadas".
 */
export function auditarPlanner(texto) {
  const plano = aPlano(texto || "");
  const resultados = REGLAS.map(r => ({ ...r, ...r.check(plano) }));
  const evaluadas = resultados.filter(r => r.cumple !== null);
  const cumplidas = evaluadas.filter(r => r.cumple === true);
  const indice = evaluadas.length ? Math.round((cumplidas.length / evaluadas.length) * 100) : 0;
  const nivel = (NIVELES.find(n => indice >= n.min) || NIVELES[NIVELES.length - 1]).nombre;
  return {
    resultados,
    evaluadas: evaluadas.length,
    total: REGLAS.length,
    cumplidas: cumplidas.length,
    indice,
    nivel,
    fallidas: evaluadas.filter(r => r.cumple === false),
    noEvaluadas: resultados.filter(r => r.cumple === null),
  };
}
