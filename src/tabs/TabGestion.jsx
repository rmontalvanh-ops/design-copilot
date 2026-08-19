import { useState, useEffect } from "react";
import { CarreraSelect, InfoBox, Inp, Lbl, Sel } from "../components/atomos";
import { OutputPanel } from "../components/salida";
import { FUENTES, PIE } from "../data/ecosistema";
import { guardarHist } from "../utils/memoria";

// ── TAB 7: GESTIÓN ────────────────────────────────────────────────────────────
export function TabGestion({marca,C,onSave}) {
  const [carrera,setCarrera]=useState(""); const [modal,setModal]=useState("");
  const [obj,setObj]=useState(""); const [asigA,setAsigA]=useState("");
  const [fmt,setFmt]=useState("markdown");
  const prompt=carrera&&obj
    ? `# PROMPT — AUDITORÍA CURRICULAR EJECUTIVA\n## ${marca} · Jefes de Carrera y Decanos\n\n**Carrera:** ${carrera} · **Asig:** ${asigA||"[Asig]"}\n**Modalidad:** ${modal||"[M]"} · **Objetivo:** ${obj}\n\n**PROTOCOLO:**\n1. Marco de referencia para ${carrera} en ${modal||"[modal]"}\n2. Checklist 18 puntos (4 dimensiones):\n   a) Coherencia curricular b) ${obj}\n   c) Calidad de experiencia (Ecosistema, Comunalidades, filamentos)\n   d) Gestión docente y recursos\n3. Preguntas guía entrevista docente (mín. 6)\n4. KPIs con semáforo 🟢🟡🔴\n5. Plantilla Informe Ejecutivo\n6. Plan mejora: 3 acciones corto + 3 mediano plazo\n7. Comunicado de resultados para el equipo docente\n\n**FUENTES:** ${FUENTES}\n${PIE(marca)}`
    : "Completa los campos para generar el protocolo de auditoría...";
  useEffect(()=>{if(carrera&&obj&&prompt.length>80){guardarHist("Gestión",carrera,prompt);onSave();}},[prompt,carrera,obj]);
  return (
    <div style={{display:"grid",gridTemplateColumns:"1fr 1fr",height:"calc(100vh - 240px)"}}>
      <div style={{padding:18,overflowY:"auto",borderRight:`1px solid ${C.border}`}}>
        <div style={{background:C.accentLight,border:`1px solid ${C.accent}`,borderRadius:7,padding:"8px 12px",marginBottom:11,fontSize:12,color:C.primary}}>🔐 <strong>Exclusivo:</strong> Jefes de Carrera y Decanos de Innovación Educativa.</div>
        <Lbl C={C}>Carrera</Lbl><CarreraSelect marca={marca} value={carrera} onChange={setCarrera} C={C}/>
        <Lbl C={C}>Asignatura a Auditar</Lbl><Inp placeholder="Ej: Cálculo Diferencial" value={asigA} onChange={setAsigA} C={C}/>
        <Lbl C={C}>Modalidad</Lbl><Sel options={["Presencial","Semipresencial","Virtual","En Línea","Teledocencia"]} value={modal} onChange={setModal} C={C}/>
        <Lbl C={C}>Objetivo de la Auditoría</Lbl>
        <Sel options={["Análisis de Brechas Curriculares","Pertinencia Laboral del Plan de Estudios","Integración de Filamentos del Ecosistema","Desempeño Docente y Metodologías"]} value={obj} onChange={setObj} C={C}/>
        <InfoBox C={C}>📊 Genera protocolo ejecutivo listo para MS Copilot con checklist, KPIs 🟢🟡🔴 y plantilla de informe Word.</InfoBox>
      </div>
      <OutputPanel prompt={prompt} fmt={fmt} setFmt={setFmt} tipo="prompt" marca={marca} C={C} tab="Gestion" carrera={carrera}/>
    </div>
  );
}

