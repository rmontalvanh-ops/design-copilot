import { useState, useEffect } from "react";
import { CarreraSelect, InfoBox, Inp, Lbl, Sel } from "../components/atomos";
import { OutputPanel } from "../components/salida";
import { ValidadorRedaccion } from "../components/ValidadorRedaccion";
import { FUENTES, PIE } from "../data/ecosistema";
import { guardarHist } from "../utils/memoria";

// ── TAB 7: GESTIÓN ────────────────────────────────────────────────────────────
export function TabGestion({marca,C,onSave}) {
  const [modo,setModo]=useState("auditoria"); // "auditoria" (Sprint H) | "protocolo" (original)
  const [carrera,setCarrera]=useState(""); const [modal,setModal]=useState("");
  const [obj,setObj]=useState(""); const [asigA,setAsigA]=useState("");
  const [fmt,setFmt]=useState("markdown");
  const [textoPlanner,setTextoPlanner]=useState("");
  const prompt=carrera&&obj
    ? `# PROMPT — AUDITORÍA CURRICULAR EJECUTIVA\n## ${marca} · Jefes de Carrera y Decanos\n\n**Carrera:** ${carrera} · **Asig:** ${asigA||"[Asig]"}\n**Modalidad:** ${modal||"[M]"} · **Objetivo:** ${obj}\n\n**PROTOCOLO:**\n1. Marco de referencia para ${carrera} en ${modal||"[modal]"}\n2. Checklist 18 puntos (4 dimensiones):\n   a) Coherencia curricular b) ${obj}\n   c) Calidad de experiencia (Ecosistema, Comunalidades, filamentos)\n   d) Gestión docente y recursos\n3. Preguntas guía entrevista docente (mín. 6)\n4. KPIs con semáforo 🟢🟡🔴\n5. Plantilla Informe Ejecutivo\n6. Plan mejora: 3 acciones corto + 3 mediano plazo\n7. Comunicado de resultados para el equipo docente\n\n**FUENTES:** ${FUENTES}\n${PIE(marca)}`
    : "Completa los campos para generar el protocolo de auditoría...";
  useEffect(()=>{if(carrera&&obj&&prompt.length>80){guardarHist("Gestión",carrera,prompt);onSave();}},[prompt,carrera,obj]);

  const tabBtn=(id,label)=>(
    <button onClick={()=>setModo(id)} style={{flex:1,padding:"9px 0",borderRadius:7,border:"none",cursor:"pointer",fontWeight:700,fontSize:11.5,fontFamily:"Poppins,sans-serif",background:modo===id?C.primary:C.bg,color:modo===id?"#fff":C.muted}}>{label}</button>
  );

  return (
    <div>
      <div style={{display:"flex",gap:8,padding:"12px 18px 0"}}>
        {tabBtn("auditoria","📐 Auditar Redacción de Planner")}
        {tabBtn("protocolo","📊 Generar Protocolo de Auditoría")}
      </div>

      {modo==="auditoria" ? (
        <div style={{padding:18}}>
          <div style={{background:C.accentLight,border:`1px solid ${C.accent}`,borderRadius:7,padding:"8px 12px",marginBottom:12,fontSize:12,color:C.primary}}>
            🔐 <strong>Exclusivo:</strong> Jefes de Carrera y Decanos. Pegá el texto del Planner de un docente (copiado del Word) para chequear las 12 reglas de redacción del Ecosistema — sin enviar nada a ningún servidor, corre en tu navegador.
          </div>
          <Lbl C={C}>Texto del Planner a auditar</Lbl>
          <textarea
            value={textoPlanner}
            onChange={e=>setTextoPlanner(e.target.value)}
            placeholder="Pegá aquí el contenido completo del Planner (Gran Idea, Historia, Metas, GRASPS, Secuencias, Rúbrica, Retrato)..."
            style={{width:"100%",minHeight:220,padding:"11px 13px",borderRadius:7,border:`1.5px solid ${C.border}`,fontFamily:"Poppins,sans-serif",fontSize:12.5,color:"#1A2340",boxSizing:"border-box",resize:"vertical",lineHeight:1.6}}
          />
          <ValidadorRedaccion texto={textoPlanner} C={C}/>
          {!textoPlanner.trim() && (
            <InfoBox C={C}>💡 El diagnóstico corre localmente sobre el texto pegado — cubre los 3 errores más frecuentes documentados por el Decano de Innovación Educativa, incluida la regla de opciones de producto en GRASPS con 100% de incidencia observada.</InfoBox>
          )}
        </div>
      ) : (
        <div style={{display:"grid",gridTemplateColumns:"1fr 1fr",height:"calc(100vh - 290px)"}}>
          <div style={{padding:18,overflowY:"auto",borderRight:`1px solid ${C.border}`}}>
            <Lbl C={C}>Carrera</Lbl><CarreraSelect marca={marca} value={carrera} onChange={setCarrera} C={C}/>
            <Lbl C={C}>Asignatura a Auditar</Lbl><Inp placeholder="Ej: Cálculo Diferencial" value={asigA} onChange={setAsigA} C={C}/>
            <Lbl C={C}>Modalidad</Lbl><Sel options={["Presencial","Semipresencial","Virtual","En Línea","Teledocencia"]} value={modal} onChange={setModal} C={C}/>
            <Lbl C={C}>Objetivo de la Auditoría</Lbl>
            <Sel options={["Análisis de Brechas Curriculares","Pertinencia Laboral del Plan de Estudios","Integración de Filamentos del Ecosistema","Desempeño Docente y Metodologías"]} value={obj} onChange={setObj} C={C}/>
            <InfoBox C={C}>📊 Genera protocolo ejecutivo listo para MS Copilot con checklist, KPIs 🟢🟡🔴 y plantilla de informe Word.</InfoBox>
          </div>
          <OutputPanel prompt={prompt} fmt={fmt} setFmt={setFmt} tipo="prompt" marca={marca} C={C} tab="Gestion" carrera={carrera}/>
        </div>
      )}
    </div>
  );
}

