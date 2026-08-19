import { useState } from "react";
import { Terminal } from "../components/Terminal";
import { CarreraSelect, Inp, Lbl, Sel } from "../components/atomos";
import { AccionButtons, Puente } from "../components/salida";
import { FUENTES, NOMBRES } from "../data/ecosistema";

// ── TAB 6: AGENTES ────────────────────────────────────────────────────────────
export function TabAgentes({marca,C}) {
  const [carrera,setCarrera]=useState(""); const [mision,setMision]=useState("");
  const [custom,setCustom]=useState(""); const [nivel,setNivel]=useState("");
  const [planner,setPlanner]=useState(false); const [lms,setLms]=useState("");
  const MISS={"📝 Diseñador de Rúbricas":"Diseñar rúbricas formativas alineadas al Ecosistema","🎯 Coach de Planificación":"Apoyar planificación trimestral alineada al sílabo y el Ecosistema","🔍 Auditor Curricular IA":"Identificar brechas entre plan oficial e implementación real","💬 Tutor de Retroalimentación":"Redactar retroalimentación formativa motivadora alineada al Ecosistema","✏️ Personalizada":custom};
  const mF=mision==="✏️ Personalizada"?custom:MISS[mision]||"";
  const prompt=carrera&&mision
    ? `\`\`\`markdown\n═══════════════════════════════════\n SYSTEM PROMPT — AGENTE COPILOTO\n ${marca} · Ecosistema de Aprendizaje\n Design Co-Pilot · System Prompt Maestro\n═══════════════════════════════════\n\n## IDENTIDAD\nCarrera: ${carrera} · Nivel: ${nivel||"[N]"} · LMS: ${lms||"[LMS]"}\nMisión: ${mF}\nInstitución: ${NOMBRES[marca]}\n\n## COMPORTAMIENTO\n1. Responde en Markdown institucional.\n2. Estructura: 📌 Análisis → 🛠️ Propuesta → ✅ Pasos → ⚠️ Validación\n3. Docente = práctico · Jefe Carrera = estratégico\n4. Output: Markdown/Texto/HTML según indique el docente\n${planner?"\n## PROTOCOLO PlanIA (9 secciones)\n1→Identidad 2→Pregunta 3→Gran Idea 4→Porqué\n5→Metas 6→Preguntas 7→GRASPS 8→Secuencias 9→Reflexión\nUna sección a la vez. Espera aprobación. Ofrece variaciones.":""}\n\n## GUARDRAILS ${marca}\n🔴 NUNCA: datos personales, calificaciones, expedientes\n🟡 AVISAR: "⚠️ Borrador sujeto a validación docente"\n🟢 LIBRE: conocimiento pedagógico del Ecosistema\n\n## AUTORÍA\n📝 IA asistida · Autor: [Docente] | ${carrera} · [DD/MM/AAAA]\n\n## RESTRICCIONES\n✗ No reemplaces el juicio docente · ✗ Sin calificaciones definitivas\n✗ Sin referencias inventadas · ✗ PG-IA-002 activa siempre\n\n## FUENTES DEL ECOSISTEMA\n${FUENTES}\n\`\`\``
    : "Selecciona carrera y misión para generar el System Prompt del Agente...";
  return (
    <div style={{display:"grid",gridTemplateColumns:"1fr 1fr",height:"calc(100vh - 240px)"}}>
      <div style={{padding:18,overflowY:"auto",borderRight:`1px solid ${C.border}`}}>
        <div style={{background:"#FEF3C7",border:"1px solid #F59E0B",borderRadius:7,padding:"8px 12px",marginBottom:11,fontSize:11.5,color:"#92400E"}}>⚠️ <strong>Sin selector de formato.</strong> Siempre Markdown puro para MS Copilot.</div>
        <Lbl C={C}>Carrera</Lbl><CarreraSelect marca={marca} value={carrera} onChange={setCarrera} C={C}/>
        <Lbl C={C}>Misión del Agente</Lbl>
        <div style={{display:"flex",flexDirection:"column",gap:4,marginTop:4}}>
          {Object.keys(MISS).map(m=><button key={m} onClick={()=>setMision(m)} style={{padding:"7px 11px",borderRadius:7,border:`1.5px solid ${mision===m?C.primary:C.border}`,background:mision===m?C.accentLight:C.white,color:C.primary,fontSize:12,cursor:"pointer",textAlign:"left",fontWeight:mision===m?700:500,fontFamily:"Poppins,sans-serif"}}>{m}</button>)}
        </div>
        {mision==="✏️ Personalizada"&&<><Lbl C={C}>Describe la misión</Lbl><Inp placeholder="Ej: Diseñar casos de estudio en Honduras..." value={custom} onChange={setCustom} C={C} rows={3}/></>}
        <Lbl C={C}>Nivel</Lbl><Sel options={["Técnico Universitario","Grado","Posgrado"]} value={nivel} onChange={setNivel} C={C}/>
        <Lbl C={C}>LMS</Lbl><Sel options={["Canvas","Moodle","Microsoft Teams","Otro"]} value={lms} onChange={setLms} C={C}/>
        <div onClick={()=>setPlanner(!planner)} style={{display:"flex",alignItems:"center",gap:8,marginTop:11,padding:"8px 11px",background:C.accentLight,borderRadius:7,cursor:"pointer"}}>
          <input type="checkbox" checked={planner} onChange={()=>{}} style={{accentColor:C.primary,width:14,height:14,pointerEvents:"none"}}/>
          <label style={{fontSize:12.5,color:C.primary,fontWeight:600,cursor:"pointer"}}>¿Incluir protocolo PlanIA (9 secciones)?</label>
        </div>
      </div>
      <div style={{padding:18,overflowY:"auto",background:C.bg}}>
        <Terminal contenido={prompt} C={C} marca={marca} titulo="Agente IA · System Prompt"/>
        {carrera&&mision&&<>
          <AccionButtons texto={prompt} fmt="markdown" copilot={true} C={C} tab="Agente" carrera={carrera}/>
          <Puente tipo="system_prompt" C={C}/>
        </>}
      </div>
    </div>
  );
}

