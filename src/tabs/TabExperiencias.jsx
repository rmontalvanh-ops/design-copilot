import { useState, useEffect, useCallback } from "react";
import { Send, CheckCircle } from "lucide-react";
import { FmtBtns } from "../components/Terminal";
import { CarreraSelect, Inp, Lbl, Sel } from "../components/atomos";
import { OutputPanel } from "../components/salida";
import { FILAMENTOS, FUENTES, NOMBRES, PIE } from "../data/ecosistema";
import { consultarIA } from "../services/ia";
import { guardarHist, mGet, mSet } from "../utils/memoria";

// ── TAB 2: EXPERIENCIAS ───────────────────────────────────────────────────────
export function TabExperiencias({marca,C,onSave}) {
  const saved=mGet("adn")||{};
  const [paso,setPaso]=useState(saved.carrera?2:1);
  const [adn,setAdn]=useState({carrera:"",asig:"",nivelG:"",tamano:"",modal:"",metod:"",fil:"",dur:"",lms:"",...saved});
  const [act,setAct]=useState({tema:"",semana:"",puntos:"",tipo:"",eval:false,ctx:""});
  const [fmt,setFmt]=useState("markdown");
  const [chatMsgs,setChatMsgs]=useState([]); const [chatInp,setChatInp]=useState(""); const [carg,setCarg]=useState(false);
  const ua=useCallback((k,v)=>{const n={...adn,[k]:v};setAdn(n);mSet("adn",n);},[adn]);

  const spm=adn.carrera
    ? `# SYSTEM PROMPT — AGENTE DOCENTE MAESTRO\n## Design Co-Pilot · ${marca}\n\n**MEMORIA PERMANENTE:**\n· ${marca} — ${NOMBRES[marca]}\n· Carrera: ${adn.carrera} · Asig: ${adn.asig||"[Asig]"}\n· Nivel: ${adn.nivelG||"[N]"} · Grupo: ${adn.tamano||"[N]"} est.\n· Modalidad: ${adn.modal||"[M]"} · Sesión: ${adn.dur||"[D]"}\n· Metodología: ${adn.metod||"[Metod]"} · Filamento: ${adn.fil||"[Fil]"}\n· LMS: ${adn.lms||"[LMS]"}\n\n**PROTOCOLO SEMANAL:**\nAl recibir nuevo tema, genera:\n1. Secuencia (${adn.metod||"3Cs/L2L"})\n2. Instrucciones + roles para estudiantes\n3. Preguntas guía — filamento "${adn.fil||"[Fil]"}"\n4. Rúbrica formativa (Emergente → En Expansión)\n5. Output listo para ${adn.lms||"LMS"}\n\n**HUMAN IN THE LOOP:** Borrador validable. Docente = autor.\nCierra con: "¿Ajustes para esta clase?"\n\n**FUENTES:**\n${FUENTES}\n${PIE(marca)}`
    : "Completa el ADN del Docente para generar el System Prompt Maestro...";

  const msgAct=act.tema
    ? `ACTIVACIÓN SEMANAL — ${marca}\n\nTema: ${act.tema}\nSemana: ${act.semana||"[N]"}\nSílabo: ${act.puntos||"[puntos]"}\nTipo: ${act.tipo||"[tipo]"}\n¿Evaluación? ${act.eval?"Sí":"No"}\n${act.ctx?`Contexto: ${act.ctx}`:""}\n\n→ Pega en tu chat de Copilot donde tienes tu System Prompt Maestro.\n${PIE(marca)}`
    : "Completa los campos para generar el mensaje de activación...";

  const enviarChat=useCallback(async()=>{
    if(!chatInp.trim()||carg) return;
    const txt=chatInp; setChatInp(""); setCarg(true);
    const nm=[...chatMsgs,{role:"user",content:txt}]; setChatMsgs(nm);
    const r=await consultarIA(nm,marca);
    setChatMsgs([...nm,{role:"assistant",content:r}]); setCarg(false);
  },[chatInp,chatMsgs,carg,marca]);

  useEffect(()=>{if(adn.carrera&&spm.length>80){guardarHist("Experiencias",adn.carrera,spm);onSave();}},[spm,adn.carrera]);
  const PASOS=["ADN del Docente","Activación Semanal","Explorar con IA"];

  return (
    <div style={{height:"calc(100vh - 240px)",display:"flex",flexDirection:"column"}}>
      {saved.carrera&&paso===1&&<div style={{background:`${C.success}15`,borderBottom:`1px solid ${C.success}30`,padding:"7px 16px",fontSize:12,color:C.success,display:"flex",alignItems:"center",gap:7}}>
        <CheckCircle size={12}/><strong>ADN recuperado:</strong> {adn.carrera} · {adn.asig||"—"} · {adn.metod||"—"}
        <button onClick={()=>setPaso(2)} style={{marginLeft:"auto",background:C.success,color:"#fff",border:"none",borderRadius:5,padding:"3px 10px",cursor:"pointer",fontSize:11,fontWeight:600,fontFamily:"Poppins,sans-serif"}}>Usar este ADN →</button>
      </div>}
      <div style={{display:"flex",borderBottom:`2px solid ${C.border}`,background:C.white}}>
        {PASOS.map((p,i)=><button key={i} onClick={()=>setPaso(i+1)} style={{flex:1,padding:"10px 0",border:"none",background:paso===i+1?C.accentLight:C.white,color:paso===i+1?C.primary:C.muted,fontWeight:paso===i+1?700:500,fontSize:12.5,cursor:"pointer",borderBottom:paso===i+1?`3px solid ${C.primary}`:"none",fontFamily:"Poppins,sans-serif"}}>{i+1}. {p}</button>)}
      </div>
      <div className="dcp-grid" style={{flex:1,overflow:"hidden"}}>
        <div style={{padding:18,overflowY:"auto",borderRight:`1px solid ${C.border}`}}>
          {paso===1&&<>
            <div style={{fontSize:11.5,color:C.muted,marginBottom:9}}>Se guarda automáticamente. Tu ADN estará aquí la próxima vez.</div>
            <Lbl C={C}>Carrera</Lbl><CarreraSelect marca={marca} value={adn.carrera} onChange={v=>ua("carrera",v)} C={C}/>
            <Lbl C={C}>Asignatura</Lbl><Inp placeholder="Ej: Cálculo I" value={adn.asig} onChange={v=>ua("asig",v)} C={C}/>
            <Lbl C={C}>Nivel del grupo</Lbl><Sel options={["Inicial (1er año)","Intermedio","Avanzado"]} value={adn.nivelG} onChange={v=>ua("nivelG",v)} C={C}/>
            <Lbl C={C}>Tamaño del grupo</Lbl><Inp placeholder="35" value={adn.tamano} onChange={v=>ua("tamano",v)} C={C} type="number"/>
            <Lbl C={C}>Modalidad</Lbl><Sel options={["Presencial","Semipresencial","Virtual"]} value={adn.modal} onChange={v=>ua("modal",v)} C={C}/>
            <Lbl C={C}>Metodología preferida</Lbl><Sel options={["3Cs (Conectar, Construir, Contribuir)","L2L (Learning to Learn)","Ambas"]} value={adn.metod} onChange={v=>ua("metod",v)} C={C}/>
            <Lbl C={C}>Filamento dominante</Lbl><Sel options={FILAMENTOS} value={adn.fil} onChange={v=>ua("fil",v)} C={C}/>
            <Lbl C={C}>Duración de la sesión</Lbl><Inp placeholder="Ej: 90 min" value={adn.dur} onChange={v=>ua("dur",v)} C={C}/>
            <Lbl C={C}>LMS Institucional</Lbl><Sel options={["Canvas","Moodle","Microsoft Teams","Otro"]} value={adn.lms} onChange={v=>ua("lms",v)} C={C}/>
            <button onClick={()=>setPaso(2)} style={{marginTop:12,width:"100%",background:C.primary,color:"#fff",border:"none",borderRadius:7,padding:"10px 0",fontWeight:700,cursor:"pointer",fontFamily:"Poppins,sans-serif"}}>Generar System Prompt Maestro →</button>
          </>}
          {paso===2&&<>
            <div style={{fontSize:11.5,color:C.muted,marginBottom:9}}>Úsalo cada semana en tu chat de Copilot.</div>
            <Lbl C={C}>Tema de esta semana</Lbl><Inp placeholder="Ej: Herencia y Polimorfismo en Java" value={act.tema} onChange={v=>setAct(p=>({...p,tema:v}))} C={C}/>
            <Lbl C={C}>Semana número</Lbl><Inp placeholder="7 de 16" value={act.semana} onChange={v=>setAct(p=>({...p,semana:v}))} C={C}/>
            <Lbl C={C}>Puntos del sílabo</Lbl><Inp placeholder="3.2, 3.3" value={act.puntos} onChange={v=>setAct(p=>({...p,puntos:v}))} C={C}/>
            <Lbl C={C}>Tipo de actividad</Lbl><Sel options={["Práctica en equipo","Conceptual individual","Evaluativa","Mixta"]} value={act.tipo} onChange={v=>setAct(p=>({...p,tipo:v}))} C={C}/>
            <Lbl C={C}>¿Evaluación esta semana?</Lbl>
            <div style={{display:"flex",gap:6,marginTop:4}}>
              {["Sí","No"].map(v=><button key={v} onClick={()=>setAct(p=>({...p,eval:v==="Sí"}))} style={{flex:1,padding:"7px 0",borderRadius:7,border:`1.5px solid ${C.primary}`,background:(act.eval&&v==="Sí")||(!act.eval&&v==="No")?C.primary:C.white,color:(act.eval&&v==="Sí")||(!act.eval&&v==="No")?"#fff":C.primary,fontWeight:600,cursor:"pointer",fontFamily:"Poppins,sans-serif"}}>{v}</button>)}
            </div>
            <Lbl C={C}>Contexto especial</Lbl><Inp placeholder="Ej: Algunos van atrasados" value={act.ctx} onChange={v=>setAct(p=>({...p,ctx:v}))} C={C}/>
            <FmtBtns fmt={fmt} setFmt={setFmt} C={C}/>
          </>}
          {paso===3&&<>
            <div style={{fontSize:11.5,color:C.muted,marginBottom:9}}>Explora variaciones antes de ir a Copilot.</div>
            {["¿Cómo adaptar para virtual?","Variación más conceptual","¿Cómo integro L2L aquí?","Dinámica de apertura 10 min","¿Qué rúbrica aplica?"].map((q,i)=>(
              <button key={i} onClick={()=>setChatInp(q)} style={{display:"block",width:"100%",padding:"8px 11px",borderRadius:7,border:`1px solid ${C.accent}`,background:C.accentLight,color:C.primary,fontSize:12,cursor:"pointer",textAlign:"left",fontFamily:"Poppins,sans-serif",marginBottom:5}}>💡 {q}</button>
            ))}
          </>}
        </div>
        <div style={{padding:18,overflowY:"auto",background:C.bg}}>
          {paso===1&&<OutputPanel prompt={spm} fmt={fmt} setFmt={setFmt} tipo="system_prompt" marca={marca} C={C} tab="Experiencias_ADN" carrera={adn.carrera}/>}
          {paso===2&&<OutputPanel prompt={msgAct} fmt={fmt} setFmt={setFmt} tipo="activacion" marca={marca} C={C} tab="Experiencias_Activacion" carrera={adn.carrera}/>}
          {paso===3&&<div style={{background:C.terminal,borderRadius:10,padding:11,height:"100%",display:"flex",flexDirection:"column"}}>
            <div style={{flex:1,overflowY:"auto",display:"flex",flexDirection:"column",gap:7,marginBottom:7}}>
              {chatMsgs.length===0&&<div style={{color:"#A8D8EA",fontSize:11.5,opacity:0.4}}>Explora variaciones con el Ecosistema...</div>}
              {chatMsgs.map((m,i)=><div key={i} style={{background:m.role==="user"?"rgba(255,255,255,0.09)":"transparent",borderRadius:5,padding:"5px 8px",fontSize:11.5,color:m.role==="user"?"#fff":"#A8D8EA",lineHeight:1.6,whiteSpace:"pre-wrap"}}><strong>{m.role==="user"?"Tú":"Ecosistema"}:</strong> {m.content}</div>)}
              {carg&&<div style={{color:"#A8D8EA",fontSize:11,fontStyle:"italic"}}>Generando variación...</div>}
            </div>
            <div style={{display:"flex",gap:5}}>
              <input value={chatInp} onChange={e=>setChatInp(e.target.value)} onKeyDown={e=>e.key==="Enter"&&enviarChat()} placeholder="Variación o pregunta..." style={{flex:1,padding:"7px 10px",borderRadius:7,border:"1px solid rgba(255,255,255,0.18)",background:"rgba(255,255,255,0.07)",color:"#fff",fontFamily:"Poppins,sans-serif",fontSize:12,outline:"none"}}/>
              <button onClick={enviarChat} disabled={carg} style={{background:C.accent,border:"none",borderRadius:7,padding:"7px 11px",cursor:"pointer",color:C.terminal}}><Send size={12}/></button>
            </div>
          </div>}
        </div>
      </div>
    </div>
  );
}

