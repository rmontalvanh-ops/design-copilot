import { useState, useEffect } from "react";
import { CarreraSelect, InfoBox, Inp, Lbl, Sel } from "../components/atomos";
import { OutputPanel } from "../components/salida";
import { FILAMENTOS, FUENTES, PIE } from "../data/ecosistema";
import { guardarHist } from "../utils/memoria";

// ── TAB 4: RÚBRICAS ───────────────────────────────────────────────────────────
export function TabRubricas({marca,C,onSave}) {
  const [carrera,setCarrera]=useState(""); const [asig,setAsig]=useState("");
  const [activ,setActiv]=useState(""); const [fil,setFil]=useState("");
  const [tipo,setTipo]=useState(""); const [nC,setNC]=useState(4);
  const [fmt,setFmt]=useState("markdown");
  const prompt=carrera
    ? `# PROMPT — RÚBRICA FORMATIVA INSTITUCIONAL\n## ${marca} | ${carrera} | ${asig||"[Asig]"}\n\n**Filamento:** ${fil||"[Fil]"} · **Evidencia:** ${activ||"[Activ]"} · **Tipo:** ${tipo||"[Tipo]"}\n\n**TAREA:** Rúbrica con ${nC} criterios y 4 niveles:\n· EMERGENTE · EN EVOLUCIÓN · EXPERTO\n· EN EXPANSIÓN → siempre extiende a contextos globales reales\n\nEncabezado: ${marca} | ${carrera}\nPeso % por criterio (total=100%)\nRetroalimentación Formativa (3 frases)\nAutoría: [Docente] · [Fecha]\n\n**FUENTES:** ${FUENTES}\n${PIE(marca)}`
    : "Selecciona carrera para generar el prompt de rúbrica...";
  useEffect(()=>{if(carrera&&prompt.length>80){guardarHist("Rúbricas",carrera,prompt);onSave();}},[prompt,carrera]);
  return (
    <div style={{display:"grid",gridTemplateColumns:"1fr 1fr",height:"calc(100vh - 240px)"}}>
      <div style={{padding:18,overflowY:"auto",borderRight:`1px solid ${C.border}`}}>
        <Lbl C={C}>Carrera</Lbl><CarreraSelect marca={marca} value={carrera} onChange={setCarrera} C={C}/>
        <Lbl C={C}>Asignatura</Lbl><Inp placeholder="Ej: Anatomía I" value={asig} onChange={setAsig} C={C}/>
        <Lbl C={C}>Actividad / Evidencia</Lbl><Inp placeholder="Ej: Informe de Práctica" value={activ} onChange={setActiv} C={C}/>
        <Lbl C={C}>Filamento del Ecosistema</Lbl><Sel options={FILAMENTOS} value={fil} onChange={setFil} C={C}/>
        <Lbl C={C}>Tipo de Evidencia</Lbl><Sel options={["Proyecto","Presentación","Ensayo","Práctica","Examen","Portafolio"]} value={tipo} onChange={setTipo} C={C}/>
        <Lbl C={C}>Criterios ({nC})</Lbl>
        <input type="range" min={4} max={7} value={nC} onChange={e=>setNC(+e.target.value)} style={{width:"100%",accentColor:C.primary,marginTop:4}}/>
        <div style={{display:"flex",justifyContent:"space-between",fontSize:10,color:C.muted,marginTop:2}}><span>4</span><span>{nC} criterios</span><span>7</span></div>
        <InfoBox C={C}>💡 <strong>En Expansión</strong> siempre exige extender el análisis a contextos globales reales — es el nivel que trasciende el aula.</InfoBox>
      </div>
      <OutputPanel prompt={prompt} fmt={fmt} setFmt={setFmt} tipo="prompt" marca={marca} C={C} tab="Rubricas" carrera={carrera}/>
    </div>
  );
}

