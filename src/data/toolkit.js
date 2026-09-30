// ── CATÁLOGO DEL ECOSISTEMA — CCC / DIP / CAR + L2L ───────────────────────────
// Fuente: raw-knowledge-base.json, base de conocimiento institucional del
// Toolkit y del L2L Toolkit (Common Ground Collaborative, CC BY-NC-ND 4.0).
// Se embebe aquí porque las URLs públicas del Toolkit no son legibles por
// máquina (aplicación JS sin contenido en el HTML servido) — este archivo es
// la fuente de verdad para el catálogo dentro de Design Co-Pilot.
//
// M5 — catálogo cerrado vigente — sujeto a reemplazo si el Comité de
// Ecosistema de Aprendizaje aprueba FO-AD-003 punto 2 ("Enfoque Pedagógico
// y Orientaciones Metodológicas"). No cambiar el comportamiento todavía;
// esta nota solo deja trazabilidad de que la regla tiene fecha de
// caducidad conocida.

export const ECOSISTEMA_DEF =
  "El aprendizaje es un proceso que conduce a una consolidación o extensión sostenida y demostrable de la comprensión conceptual, las competencias o el carácter.";

export const DIMENSIONES = [
  { nombre: "Contexto", desc: "Los estudiantes aprenden conectados a los desafíos reales del mundo actual: industria, tecnología, transformación digital y retos sociales." },
  { nombre: "Comunidad", desc: "Red activa de docentes, compañeros, aliados y egresados que acompañan, retan y enriquecen el proceso formativo." },
  { nombre: "Cultura", desc: "La ética, la responsabilidad, la mentalidad de crecimiento y el compromiso social forman parte de la experiencia universitaria." },
  { nombre: "Currículo", desc: "Programas pertinentes, flexibles y actualizados que integran teoría, práctica y experiencia aplicada." },
];

// Las 24 técnicas de CCC (Conectar/Construir/Contribuir), organizadas por fase.
export const TECNICAS_CCC = {
  conectar: [
    "Chalk Talk", "See Think Wonder", "Give One Take One",
    "Question Formulation Technique (QFT)", "Question Starts", "Question Funnel",
    "Question Sorts", "Wonder Wall",
  ],
  construir: [
    "Question on the Wall", "Tug of War", "Carousel Brainstorm",
    "The Story Routine (Main, Side, Hidden)", "Sketchnoting", "Causal Interaction Map",
    "Hexagons", "Connection Circle",
  ],
  contribuir: [
    "Module Summary Matrix", "Claim-Support-Question", "Consensus 1-3-6",
    "Placemat", "Theory Journal Conversations", "Bloom's Taxonomy Reflection Questions",
    "Four Corners", "Experience, Struggles, Puzzles, Insights (ESPI)",
  ],
};

// Las 3 de DIP (Competencia) y las 3 de CAR (Carácter).
export const TECNICAS_DIP = {
  deconstruir: ["Deconstrucción de Expertos"],
  identificar: ["My Favorite No Strategy"],
  practicar: ["Práctica Deliberada"],
};
export const TECNICAS_CAR = {
  considerar: ["Análisis de Valores"],
  actuar: ["Proyectos de Servicio"],
  reflexionar: ["Reflexión de Impacto"],
};

// El continuo L2L: de la dependencia transaccional a la autonomía trascendente.
export const CONTINUO_L2L = [
  { nivel: "Transaccional", desc: "El aprendizaje es visto como una tarea a completar con dependencia externa total de la calificación o del docente." },
  { nivel: "Transicional", desc: "Experimentación incipiente con estrategias de aprendizaje y consideración de su relevancia." },
  { nivel: "Transformacional", desc: "Apropiación intencional y estratégica del propio aprendizaje, aplicando feedback S.T.A.R. y co-creando criterios." },
  { nivel: "Trascendente", desc: "Capacidad humana plena, autodirigida y sin límites visibles, impulsada por la curiosidad radical." },
];

export const TECNICAS_L2L = [
  { nombre: "El Espejo de Pensamiento", proposito: "Reconocer y nombrar patrones de pensamiento individuales durante el aprendizaje." },
  { nombre: "Reporte del Clima de Aprendizaje", proposito: "Construir conciencia de los estados emocionales y su impacto en el rendimiento." },
  { nombre: "Tarjeta de Cambio de Estrategia", proposito: "Reconocer cuándo cambiar de estrategia de manera independiente." },
  { nombre: "Think-Aloud (Pensar en Voz Alta)", proposito: "Modelar y hacer visible el pensamiento metacognitivo durante la resolución de problemas." },
];

// Secuencia adicional documentada en el contexto institucional del proyecto,
// no incluida en el catálogo JSON de 34 técnicas — se ofrece como alternativa
// declarada, no como parte del catálogo oficial verificado.
export const SECUENCIA_5ES = ["Involucrar (Engage)", "Explorar (Explore)", "Explicar (Explain)", "Elaborar (Elaborate)", "Evaluar (Evaluate)"];

/** Lista compacta "Fase: técnica, técnica..." para embeber en un System Prompt sin inflar tokens con las descripciones completas. */
export function catalogoCompacto() {
  const l = (o) => Object.entries(o).map(([fase, tecs]) => `  · ${fase[0].toUpperCase()}${fase.slice(1)}: ${tecs.join(", ")}`).join("\n");
  return `**CCC (Concepto):**\n${l(TECNICAS_CCC)}\n**DIP (Competencia):**\n${l(TECNICAS_DIP)}\n**CAR (Carácter):**\n${l(TECNICAS_CAR)}`;
}
