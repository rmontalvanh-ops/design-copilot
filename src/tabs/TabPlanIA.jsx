import { useState, useEffect, useCallback } from "react";
import { Send } from "lucide-react";
import { ValidadorRedaccion } from "../components/ValidadorRedaccion";
import { FmtBtns, Terminal } from "../components/Terminal";
import { CarreraSelect, ComunalidadSelect, Inp, Lbl, Sel } from "../components/atomos";
import { AccionButtons, OutputPanel } from "../components/salida";
import { COMUNALIDADES, FUENTES, NOMBRES, PIE, RETRATO } from "../data/ecosistema";
import { CONTINUO_L2L, SECUENCIA_5ES, catalogoCompacto } from "../data/toolkit";
import { consultarIA } from "../services/ia";
import { guardarHist } from "../utils/memoria";

// ── TAB 1: PlanIA ─────────────────────────────────────────────────────────────
export function TabPlanIA({marca,C,onSave}) {
  const [carrera,setCarrera]=useState(""); const [nivel,setNivel]=useState("");
  const [asig,setAsig]=useState(""); const [modal,setModal]=useState("");
  const [com,setCom]=useState(""); const [retrato,setRetrato]=useState([]);
  const [modo,setModo]=useState("A"); const [fmt,setFmt]=useState("markdown");
  const [chatMsgs,setChatMsgs]=useState([]); const [sec,setSec]=useState(0);
  const [chatInp,setChatInp]=useState(""); const [carg,setCarg]=useState(false);
  const [plannerFinal,setPlanFinal]=useState("");
  // Contenido aprobado de cada sección. Antes se perdía al avanzar.
  const [secciones,setSecciones]=useState(()=>Array(9).fill(""));

  const SECS=["Identidad del Curso","Pregunta Atractiva","Gran Idea","El Porqué","Metas de Aprendizaje","Preguntas Marco","Evidencia GRASPS","Secuencias Didácticas","Reflexión y Transferencia"];
  const CHIPS_S=[
    ["Ficha técnica + Competencia del sílabo","¿Cuál Comunalidad sugiere el Ecosistema?","Alinea Disciplina → Comunalidad → Retrato"],
    ["Genera 3 opciones de pregunta","Estilo titular estudiantil","Sin jerga académica"],
    ["Construye la Gran Idea","Formato 'Entender que...'","Hazla más transferible"],
    ["Historia para el docente","Historia para el estudiante","'...Por eso este módulo importa'"],
    ["Meta conceptual «comprenden que…» + unidad del sílabo","Meta de competencia «son capaces de…» + competencia del sílabo","Meta de Carácter «se convierten en…»","Meta L2L «desarrollan la capacidad de…»"],
    ["Preguntas conceptuales","Preguntas de Carácter","Preguntas L2L"],
    ["GRASPS con 2-3 opciones de producto","No-GRASPS: transformar actividades del sílabo","Rúbrica 4 niveles"],
    ["Secuencia CCC (concepto)","Secuencia DIP (competencia)","Secuencia CAR (carácter)","Técnica del catálogo del Ecosistema"],
    ["Reflexión del estudiante","Transferencia fuera del aula","Reflexión del docente"]
  ];
  const comSel=COMUNALIDADES.find(c=>c.valor===com);
  const toggleR=(v)=>setRetrato(p=>p.includes(v)?p.filter(x=>x!==v):p.length<3?[...p,v]:p);

  const prompt=carrera
    ? `# AGENTE DEL ECOSISTEMA DE APRENDIZAJE — PlanIA
## ${NOMBRES[marca]} (${marca}) · Design Co-Pilot · System Prompt Maestro

**Carrera:** ${carrera} · **Nivel:** ${nivel||"[Nivel]"}
**Asignatura:** ${asig||"[Asig]"} · **Modalidad:** ${modal||"[Modal]"}

---

## 1 · Quién sos

Sos un colega estratégico, un mentor empático y un colíder de codiseño curricular junto al equipo docente de ${marca}. No autás, no fiscalizás y no evaluás de forma punitiva: guiás de manera interactiva la construcción del Planner de **${asig||"esta asignatura"}**, validando en cada paso que el diseño quede alineado al Ecosistema de Aprendizaje institucional.

El docente es tu colaborador y quien valida cada decisión — vos proponés, el docente aprueba o ajusta.

---

## 2 · Antes de generar contenido — regla crítica

No propongas contenido disciplinar ni secuencias hasta tener:
1. El **Sílabo oficial** de la asignatura.
2. El **Nivel académico** confirmado: Técnico, Grado o Posgrado.
3. Si el Planner es de **Grado o Posgrado** (ajusta el rigor taxonómico y la autonomía esperada del estudiante).

Si falta alguno, pedilo antes de avanzar — no lo asumas ni lo inventes.

**Cómo avanzás:** una sección a la vez, con aprobación explícita antes de seguir a la siguiente. Orden: Identidad del Curso → Pregunta Atractiva → Gran Idea → El Porqué → Metas de Aprendizaje → Preguntas Marco → Evidencia y Rúbrica → Secuencias → Reflexión y Transferencia.

---

## 3 · Alineación institucional — 100% vinculada, no negociable

$$\\text{${carrera}} \\longrightarrow \\text{${com||"[Comunalidad Humana Central]"}} \\longrightarrow \\text{${retrato[0]||"[Retrato del Egresado]"}}$$

**Comunalidad Humana Central:** ${com||"[Seleccionar]"}${comSel?`\n**Retrato vinculado (fijo — no elegible libremente):** ${comSel.retrato}\n**Enfoque:** ${comSel.desc}`:""}

**Retrato del Egresado declarado:** ${retrato.length?retrato.join(", "):"[Seleccionar — máx. 3]"}

Esta Comunalidad tiene un único Retrato vinculado en el Ecosistema institucional. Si el docente quiere otro Retrato, primero hay que cambiar la Comunalidad — nunca desvincular ambos.

---

## 4 · Fórmulas obligatorias — usar textualmente, no parafrasear

- **Gran Idea:** "Entender que..."
- **Meta Conceptual:** "Los estudiantes comprenden que..." — podés anclarla a las unidades del sílabo (ej. "...que abarca las Unidades 1 a 4 del sílabo").
- **Meta de Competencia:** "Los estudiantes son capaces de..." + verbo observable de la Taxonomía institucional. Vinculá esta meta a la(s) **Competencia(s) general(es) del sílabo** — citalas explícitamente.
- **Meta de Carácter:** "Los estudiantes se convierten en..." — vinculada a una capacidad del Retrato ya declarado arriba. **Usá exactamente las mismas capacidades del Retrato de la sección 3, ninguna distinta** — es el error más difícil de notar al redactar y el más fácil de evitar si mantenés la misma lista en ambos lugares.
- **Meta L2L:** "Los estudiantes desarrollan la capacidad de..."
- **Cierre de ambas Historias** (docente y estudiante): "...Por eso este módulo importa."

---

## 5 · La Evidencia

**GRASPS:** diseñá **2 o 3 opciones de producto** dentro de la tarea — nunca un entregable único. Rol profesional que cambie el contexto (no "estudiante que hace un trabajo"). Audiencia, Situación y Criterios de Éxito verificables.

**No-GRASPS:** tomá **todas las actividades del sílabo que no sean examen** y transformalas —no las inventes— usando una técnica del catálogo del Ecosistema (sección 7). El patrón es "transformar lo existente", no "agregar dinámicas nuevas": una guía repetitiva se vuelve una Tarea Reflexiva, un foro tradicional se vuelve un Tug of War, un reporte descriptivo se vuelve un Causal Interaction Map.

**Rúbrica:** 4 niveles institucionales en orden — Emergente · En Evolución · Experto · **En Expansión** (este último exige siempre llevar el análisis a un contexto global real o incluir voces y perspectivas diversas).

---

## 6 · Las Secuencias — una por cada tipo de meta

- **CCC** (Meta Conceptual): Conectar → Construir → Contribuir.
- **DIP** (Meta de Competencia): Deconstruir → Identificar → Practicar.
- **CAR** (Meta de Carácter): Considerar → Actuar → Reflexionar.
- **5Es** (alternativa declarada, no forma parte del catálogo verificado del Ecosistema): ${SECUENCIA_5ES.join(" → ")}. Usala solo si el docente la pide explícitamente.

**Catálogo de técnicas del Ecosistema** (Common Ground Collaborative, CC BY-NC-ND 4.0) — elegí la técnica según la fase, no la fuerces:
${catalogoCompacto()}

---

## 7 · Aprender a Aprender (L2L)

Continuo de autonomía del estudiante: ${CONTINUO_L2L.map(n=>n.nivel).join(" → ")}.

Las metas L2L incluyen monitorear su propio progreso y dar/recibir retroalimentación **S.T.A.R.** (Específica, Oportuna, Accionable, Respetuosa).

---

## 8 · Cómo actuás en la conversación

- **Manejo de objeciones:** ante resistencia o escepticismo ("en esta materia no aplica", "esto toma mucho tiempo"), validá la preocupación con empatía profesional y reformulá la propuesta en **micro-pasos** de alto impacto — nunca insistas sin más.
- **Carga de trabajo viable:** antes de proponer una tarea GRASPS o una secuencia, evaluá si es realista para el tiempo de aula y de evaluación real del docente. No propongas andamios que saturen su carga.
- **Aprendizaje adaptativo:** ajustá el nivel de detalle de tus sugerencias según el tono y las correcciones del docente durante la misma sesión.

---

## 9 · Prohibiciones

- No inventes contenido disciplinar fuera del sílabo provisto.
- No respondas bajo ambigüedad de Nivel o tipo de Planner sin pedir la confirmación.
- No reduzcas el Ecosistema a dinámicas sueltas sin hilo conductor visible hacia el Retrato.
- Nunca uses la sigla "CGS" con el docente — el nombre siempre es **Ecosistema de Aprendizaje**.

---

**FUENTES:** ${FUENTES}
${PIE(marca)}`
    : "Selecciona carrera para generar el System Prompt del agente PlanIA...";

  useEffect(()=>{if(carrera&&prompt.length>100){guardarHist("PlanIA",carrera,prompt);onSave();}},[prompt,carrera]);

  const enviarChat=useCallback(async()=>{
    if(!chatInp.trim()||carg) return;
    const txt=chatInp; setChatInp(""); setCarg(true);
    const nm=[...chatMsgs,{role:"user",content:txt}]; setChatMsgs(nm);
    const r=await consultarIA(nm,marca);
    setChatMsgs([...nm,{role:"assistant",content:r}]); setCarg(false);
  },[chatInp,chatMsgs,carg,marca]);

  return (
    <div className="dcp-grid" style={{height:"calc(100vh - 240px)"}}>
      <div style={{padding:18,overflowY:"auto",borderRight:`1px solid ${C.border}`}}>
        <div style={{display:"flex",gap:6,marginBottom:13}}>
          {["A","B"].map(m=><button key={m} onClick={()=>setModo(m)} style={{flex:1,padding:"7px 0",borderRadius:7,border:`2px solid ${C.primary}`,background:modo===m?C.primary:C.white,color:modo===m?C.white:C.primary,fontWeight:700,fontSize:12,cursor:"pointer",fontFamily:"Poppins,sans-serif"}}>{m==="A"?"MODO A — System Prompt":"MODO B — Co-diseño"}</button>)}
        </div>
        <Lbl C={C}>Carrera</Lbl><CarreraSelect marca={marca} value={carrera} onChange={setCarrera} C={C}/>
        <Lbl C={C}>Nivel</Lbl><Sel options={["Técnico Universitario","Grado","Posgrado"]} value={nivel} onChange={setNivel} C={C}/>
        <Lbl C={C}>Asignatura</Lbl><Inp placeholder="Ej: Programación OO" value={asig} onChange={setAsig} C={C}/>
        <Lbl C={C}>Modalidad</Lbl><Sel options={["Presencial","Semipresencial","Virtual","En Línea"]} value={modal} onChange={setModal} C={C}/>
        <Lbl C={C}>Comunalidad Humana Central</Lbl><ComunalidadSelect value={com} onChange={setCom} C={C}/>
        <Lbl C={C}>Retrato del Egresado (máx. 3)</Lbl>
        <div style={{display:"flex",flexWrap:"wrap",gap:5,marginTop:4}}>
          {RETRATO.map(v=><button key={v} onClick={()=>toggleR(v)} style={{padding:"4px 9px",borderRadius:20,border:`1.5px solid ${C.primary}`,background:retrato.includes(v)?C.primary:C.white,color:retrato.includes(v)?C.white:C.primary,fontSize:11,fontWeight:600,cursor:"pointer",fontFamily:"Poppins,sans-serif"}}>{v}</button>)}
        </div>
      </div>
      {modo==="A"
        ? <OutputPanel prompt={prompt} fmt={fmt} setFmt={setFmt} tipo="system_prompt" marca={marca} C={C} tab="PlanIA" carrera={carrera}/>
        : <div style={{padding:18,overflowY:"auto",background:C.bg}}>
            {plannerFinal
              ? <><Terminal contenido={plannerFinal} C={C} marca={marca} titulo="PlanIA · Planner completo"/><FmtBtns fmt={fmt} setFmt={setFmt} C={C}/><AccionButtons texto={plannerFinal} fmt={fmt} C={C} tab="PlanIA_Completo" carrera={carrera}/><ValidadorRedaccion texto={plannerFinal} C={C}/></>
              : <>
                  <div style={{display:"flex",gap:2,marginBottom:8}}>
                    {SECS.map((s,i)=><div key={i} title={`${s}${secciones[i]?" · contenido guardado":""}`} style={{flex:1,height:5,borderRadius:3,background:i===sec?C.primary:secciones[i]?C.success:i<sec?C.accent:C.border}}/>)}
                  </div>
                  <div style={{background:C.accentLight,borderRadius:7,padding:"8px 12px",marginBottom:8,border:`1px solid ${C.border}`}}>
                    <div style={{fontSize:9.5,fontWeight:700,color:C.muted,textTransform:"uppercase",letterSpacing:1}}>Sección {sec+1} de 9</div>
                    <div style={{fontWeight:700,color:C.primary,fontSize:13}}>{SECS[sec]}</div>
                  </div>
                  <div style={{display:"flex",flexWrap:"wrap",gap:4,marginBottom:7}}>
                    {(CHIPS_S[sec]||[]).map((ch,i)=><button key={i} onClick={()=>setChatInp(ch)} style={{padding:"3px 8px",borderRadius:20,border:`1px solid ${C.accent}`,background:C.accentLight,color:C.primary,fontSize:10.5,cursor:"pointer",fontFamily:"Poppins,sans-serif"}}>💡 {ch}</button>)}
                  </div>
                  <div style={{background:C.terminal,borderRadius:10,padding:11,height:255,display:"flex",flexDirection:"column",gap:6}}>
                    <div style={{flex:1,overflowY:"auto",display:"flex",flexDirection:"column",gap:6}}>
                      {chatMsgs.length===0&&<div style={{color:"#A8D8EA",fontSize:11.5,opacity:0.4}}>Usa los chips o escribe para iniciar sección {sec+1}...</div>}
                      {chatMsgs.map((m,i)=><div key={i} style={{background:m.role==="user"?"rgba(255,255,255,0.09)":"transparent",borderRadius:5,padding:"5px 8px",fontSize:11.5,color:m.role==="user"?"#fff":"#A8D8EA",lineHeight:1.6,whiteSpace:"pre-wrap"}}><strong>{m.role==="user"?"Tú":"PlanIA"}:</strong> {m.content}</div>)}
                      {carg&&<div style={{color:"#A8D8EA",fontSize:11,fontStyle:"italic"}}>PlanIA diseñando sección {sec+1}...</div>}
                    </div>
                    <div style={{display:"flex",gap:5}}>
                      <input value={chatInp} onChange={e=>setChatInp(e.target.value)} onKeyDown={e=>e.key==="Enter"&&enviarChat()} placeholder={`Contexto para "${SECS[sec]}"...`} style={{flex:1,padding:"6px 9px",borderRadius:6,border:"1px solid rgba(255,255,255,0.18)",background:"rgba(255,255,255,0.07)",color:"#fff",fontFamily:"Poppins,sans-serif",fontSize:12,outline:"none"}}/>
                      <button onClick={enviarChat} disabled={carg} style={{background:C.accent,border:"none",borderRadius:6,padding:"6px 10px",cursor:"pointer",color:C.terminal}}><Send size={12}/></button>
                    </div>
                  </div>
                  <div style={{display:"flex",gap:6,marginTop:7}}>
                    <button onClick={()=>{
                      // Guarda lo aprobado ANTES de limpiar el chat.
                      const ultima=[...chatMsgs].reverse().find(m=>m.role==="assistant");
                      const nuevas=[...secciones];
                      nuevas[sec]=ultima?ultima.content:"_(sección sin contenido co-diseñado)_";
                      setSecciones(nuevas);
                      if(sec<8){ setSec(s=>s+1); setChatMsgs([]); }
                      else setPlanFinal(
                        `# PLANNER INSTITUCIONAL\n## ${asig||"Asignatura"} · ${carrera} · ${nivel||"Grado"}\n\n`+
                        `**Modalidad:** ${modal||"—"}\n**Comunalidad Humana Central:** ${com||"—"}`+
                        `${comSel?` → ${comSel.retrato}`:""}\n**Retrato del Egresado:** ${retrato.join(" · ")||"—"}\n\n---\n\n`+
                        SECS.map((s,i)=>`## ${i+1}. ${s}\n\n${nuevas[i]||"_(pendiente)_"}`).join("\n\n---\n\n")+
                        `\n${PIE(marca)}`
                      );
                    }} style={{flex:2,background:C.primary,color:"#fff",border:"none",borderRadius:7,padding:"9px 0",fontWeight:700,fontSize:12,cursor:"pointer",fontFamily:"Poppins,sans-serif"}}>✅ {sec<8?"Aprobar y Continuar →":"Generar Planner Completo"}</button>
                    <button onClick={()=>enviarChat()} style={{flex:1,background:C.white,color:C.primary,border:`1.5px solid ${C.primary}`,borderRadius:7,padding:"9px 0",fontWeight:600,fontSize:12,cursor:"pointer",fontFamily:"Poppins,sans-serif"}}>🔄 Variación</button>
                  </div>
                </>}
          </div>}
    </div>
  );
}

