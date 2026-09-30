// ── AFINIDADES CAPACIDAD HUMANA → METODOLOGÍA / EVIDENCIA / INSTRUMENTO ───────
// Fuente: "Grafo del Ecosistema de Aprendizaje UNITEC-CEUTEC" (164 nodos, 343
// relaciones), citando FORMATO_SILABO_COMPETENCIAS_CEUTEC_V1, la Base
// Institucional de Orientaciones Metodológicas, Evidencias y Evaluación —
// CEUTEC 2026, y el catálogo B/I/A de Metodologías y actividades de
// enseñanza-aprendizaje.
//
// IMPORTANTE — naturaleza de esta tabla: es una relación de AFINIDAD GENERAL
// (afin_a, se_manifiesta_en, instrumento_sugerido), no una herencia obligatoria
// por subcompetencia. No existe todavía, para la mayoría de carreras, un
// mapeo subcompetencia→capacidad humana específico. Mientras ese mapeo no
// exista, esta tabla es la mejor guía disponible con respaldo documental — y
// debe reemplazar cualquier sugerencia que la app genere "por criterio
// propio". Se usa como SUGERENCIA en la UI, nunca como imposición: el
// docente siempre puede elegir otra metodología, evidencia o instrumento.
//
// M5 — nota de vigencia: el catálogo cerrado de metodologías que aparece
// aquí (columna "afinA") sigue vigente MIENTRAS el Comité de Ecosistema de
// Aprendizaje no apruebe el reemplazo por "Enfoque Pedagógico y
// Orientaciones Metodológicas" (FO-AD-003, punto 2 de la Recomendación
// institucional — Decisión propuesta al Comité, aún sin resolver). Si esa
// propuesta se aprueba, esta tabla deja de ser un catálogo cerrado y pasa a
// ser un conjunto de ejemplos dentro de un criterio más abierto — no borrar,
// pero sí revisar la instrucción de uso en TabPlanIA/TabCompetencias.

export const AFINIDADES_CAPACIDAD_HUMANA = {
  "Líder con Propósito": {
    seManifiestaEn: ["Reflexiones estructuradas", "Planes de acción", "Autoevaluaciones", "Toma de decisiones fundamentadas", "Simulaciones de liderazgo"],
    afinA: ["Aula Invertida", "Simulación", "Aprendizaje Basado en Proyectos", "Juego de Roles"],
    instrumentoSugerido: ["Diario reflexivo", "Escala de valoración", "Rúbrica de liderazgo"],
  },
  "Ciudadano Responsable": {
    seManifiestaEn: ["Proyectos con impacto social", "Análisis éticos", "Evaluaciones de impacto", "Investigaciones aplicadas"],
    afinA: ["Investigación Aplicada", "Aprendizaje Basado en Casos", "Aprendizaje + Servicio", "Consultoría Aplicada"],
    instrumentoSugerido: ["Rúbrica de impacto", "Informe técnico", "Reporte reflexivo"],
  },
  "Solucionador de Problemas Empático": {
    seManifiestaEn: ["Diagnósticos", "Recomendaciones", "Soluciones propuestas", "Casos resueltos"],
    afinA: ["Aprendizaje Basado en Problemas", "Aprendizaje Basado en Casos", "Simulación", "Pensamiento de Diseño"],
    instrumentoSugerido: ["Rúbrica de resolución de problemas", "Lista de cotejo", "Guía de análisis"],
  },
  "Innovador Creativo": {
    seManifiestaEn: ["Prototipos", "Diseños", "Productos", "Soluciones innovadoras"],
    afinA: ["Pensamiento de Diseño", "Prototipado y Prueba", "Aprendizaje Basado en Proyectos", "Investigación"],
    instrumentoSugerido: ["Rúbrica de innovación", "Portafolio", "Rúbrica de proyecto"],
  },
  "Colaborador Constructivo": {
    seManifiestaEn: ["Proyectos colaborativos", "Productos grupales", "Coevaluaciones", "Simulaciones colaborativas"],
    afinA: ["Aprendizaje Cooperativo", "Aprendizaje Colaborativo", "TBL", "Aprendizaje Basado en Proyectos"],
    instrumentoSugerido: ["Coevaluación", "Rúbrica grupal", "Escala de trabajo colaborativo"],
  },
  "Comunicador Efectivo": {
    seManifiestaEn: ["Presentaciones", "Debates", "Argumentaciones", "Informes"],
    afinA: ["Enseñanza Recíproca", "Debate", "Aprendizaje Basado en Casos", "Juego de Roles"],
    instrumentoSugerido: ["Rúbrica de presentación", "Rúbrica de argumentación", "Guía de observación"],
  },
};

// Categorías modales de metodología — nivel de clasificación nuevo (FO-AD-003 /
// Grafo), no existía en ninguna fuente anterior. Útil para agrupar el catálogo
// por momento pedagógico, no solo por capacidad humana.
export const CATEGORIAS_MODALES = {
  comprension: ["Aula Invertida", "Enseñanza Recíproca", "Práctica de Recuperación"],
  aplicacion: ["Estudio de Casos", "Debate", "Aprendizaje Cooperativo", "Simulación"],
  integracion: ["Aprendizaje Basado en Problemas", "Aprendizaje Basado en Proyectos", "Pensamiento de Diseño", "Consultoría Aplicada", "TBL"],
};

/** Sugerencia compacta para una Capacidad Humana — null si no hay match (nombre distinto al oficial). */
export function sugerenciaPara(capacidad) {
  return AFINIDADES_CAPACIDAD_HUMANA[capacidad] || null;
}
