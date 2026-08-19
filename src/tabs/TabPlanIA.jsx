import { useState, useEffect, useCallback } from "react";
import { Send } from "lucide-react";
import { FmtBtns, Terminal } from "../components/Terminal";
import { CarreraSelect, ComunalidadSelect, Inp, Lbl, Sel } from "../components/atomos";
import { AccionButtons, OutputPanel } from "../components/salida";
import { COMUNALIDADES, FUENTES, NOMBRES, PIE, RETRATO } from "../data/ecosistema";
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
    ["Ficha técnica completa","¿Cuál Comunalidad sugiere el Ecosistema?","Alinea Disciplina → Comunalidad → Retrato"],
    ["Genera 3 opciones de pregunta","Estilo titular estudiantil","Sin jerga académica"],
    ["Construye la Gran Idea","Formato 'Entender que...'","Hazla más transferible"],
    ["Historia para el docente","Historia para el estudiante","'...Por eso este módulo importa'"],
    ["Meta conceptual «comprenden que…»","Meta de Carácter","Meta L2L"],
    ["Preguntas conceptuales","Preguntas de Carácter","Preguntas L2L"],
    ["GRASPS completo","2-3 opciones de producto","Rol y Audiencia","Rúbrica 4 niveles"],
    ["Secuencia 3Cs","Flujo L2L (DIP)","Modelo CAR (Carácter)"],
    ["Reflexión del estudiante","Transferencia fuera del aula","Reflexión del docente"]
  ];
  const comSel=COMUNALIDADES.find(c=>c.valor===com);
  const toggleR=(v)=>setRetrato(p=>p.includes(v)?p.filter(x=>x!==v):p.length<3?[...p,v]:p);

  const prompt=carrera
    ? `# SYSTEM PROMPT — AGENTE PlanIA\n## Design Co-Pilot · System Prompt Maestro · ${marca}\n\n**Carrera:** ${carrera} · **Nivel:** ${nivel||"[Nivel]"}\n**Asignatura:** ${asig||"[Asig]"} · **Modalidad:** ${modal||"[Modal]"}\n\n**COMUNALIDAD HUMANA CENTRAL:** ${com||"[Comunalidad]"}${comSel?`\n→ Retrato vinculado: ${comSel.retrato}\n→ Enfoque: ${comSel.desc}`:""}\n\n**RETRATO DEL EGRESADO:** ${retrato.length?retrato.join(", "):"[Seleccionar — máx. 3]"}\n\n**ALINEACIÓN:** ${carrera} → ${com||"[Comunalidad]"} → ${retrato[0]||"[Retrato]"}\n\n**MISIÓN:** Co-diseñar el Planner institucional (9 secciones) bajo el Ecosistema de Aprendizaje de ${NOMBRES[marca]}.\n\n**REGLA CRÍTICA:** Solicita el Sílabo oficial antes de generar contenido disciplinar.\n\n**FLUJO (una sección a la vez — espera aprobación):**\n1. Identidad del Curso → 2. Pregunta Atractiva → 3. Gran Idea ("Entender que...")\n4. El Porqué → 5. Metas (Conceptual + Competencia + Carácter + L2L) → 6. Preguntas Marco\n7. Evidencia GRASPS + Rúbrica → 8. Secuencias (3Cs/DIP/CAR) → 9. Reflexión y Transferencia\n\n**FÓRMULAS OBLIGATORIAS — usar textualmente, no parafrasear:**\n- Gran Idea: "Entender que..."\n- Meta Conceptual: "Los estudiantes comprenden que..."\n- Meta de Competencia: "Los estudiantes son capaces de..." + verbo observable (Taxonomía UNITEC)\n- Meta de Carácter: "Los estudiantes se convierten en..." — vincular a una capacidad del Retrato\n- Meta L2L: "Los estudiantes desarrollan la capacidad de..."\n- Cierre de ambas Historias: "...Por eso este módulo importa."\n\n**REGLAS DE EVIDENCIA (sección 7):**\n- El GRASPS debe ofrecer al estudiante 2 o 3 OPCIONES de producto, nunca un entregable único.\n- El Rol debe ser profesional y cambiar el contexto, no "estudiante que hace un trabajo".\n- Incluir Rúbrica con los 4 niveles institucionales en este orden: Emergente · En Evolución · Experto · En Expansión, con descriptores propios de la tarea.\n\n**REGLA DE COHERENCIA:** las capacidades del Retrato declaradas arriba deben ser exactamente las mismas que aparezcan en la Meta del Carácter. No agregues ni omitas ninguna.\n\n**FUENTES:** ${FUENTES}\n${PIE(marca)}`
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
    <div style={{display:"grid",gridTemplateColumns:"1fr 1fr",height:"calc(100vh - 240px)"}}>
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
              ? <><Terminal contenido={plannerFinal} C={C} marca={marca} titulo="PlanIA · Planner completo"/><FmtBtns fmt={fmt} setFmt={setFmt} C={C}/><AccionButtons texto={plannerFinal} fmt={fmt} C={C} tab="PlanIA_Completo" carrera={carrera}/></>
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

