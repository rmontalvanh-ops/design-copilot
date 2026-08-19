import { useState, useEffect } from "react";
import { CarreraSelect, InfoBox, Inp, Lbl, Sel } from "../components/atomos";
import { OutputPanel } from "../components/salida";
import { FUENTES, PIE, RETRATO } from "../data/ecosistema";
import { guardarHist } from "../utils/memoria";

// ── TAB 5: COMPETENCIAS ───────────────────────────────────────────────────────
export function TabCompetencias({marca,C,onSave}) {
  const [carrera,setCarrera]=useState(""); const [asig,setAsig]=useState("");
  const [cap,setCap]=useState(""); const [ras,setRas]=useState("");
  const [ctx,setCtx]=useState(""); const [fmt,setFmt]=useState("markdown");
  const prompt=carrera
    ? `# PROMPT — COMPETENCIAS Y CARÁCTER\n## ${marca} · Ecosistema de Aprendizaje\n\n**Carrera:** ${carrera} · **Asig:** ${asig||"[Asig]"}\n**Retrato:** ${cap||"[Cap]"} · **Carácter:** ${ras||"[Rasgo]"} · **Momento:** ${ctx||"[Ctx]"}\n\n**TAREA:**\n1. Alineación: ${carrera} → Comunalidad → ${cap||"[Retrato]"}\n2. Meta de Carácter: "Al final, el estudiante será más ${ras||"[rasgo]"} porque..."\n3. Dinámica CAR:\n   · Considerar (10 min): dilema ético o situación provocadora\n   · Actuar (20 min): decisión o acción visible\n   · Reflexionar (15 min): ¿En quién me estoy convirtiendo?\n4. Preguntas de Carácter (sin respuesta única)\n5. Indicadores observables del rasgo "${ras||"[rasgo]"}"\n\n**FUENTES:** ${FUENTES}\n${PIE(marca)}`
    : "Selecciona carrera para generar el prompt de Competencias y Carácter...";
  useEffect(()=>{if(carrera&&prompt.length>80){guardarHist("Competencias",carrera,prompt);onSave();}},[prompt,carrera]);
  return (
    <div style={{display:"grid",gridTemplateColumns:"1fr 1fr",height:"calc(100vh - 240px)"}}>
      <div style={{padding:18,overflowY:"auto",borderRight:`1px solid ${C.border}`}}>
        <Lbl C={C}>Carrera</Lbl><CarreraSelect marca={marca} value={carrera} onChange={setCarrera} C={C}/>
        <Lbl C={C}>Asignatura</Lbl><Inp placeholder="Ej: Ética Profesional" value={asig} onChange={setAsig} C={C}/>
        <Lbl C={C}>Capacidad del Retrato del Egresado</Lbl><Sel options={RETRATO} value={cap} onChange={setCap} C={C}/>
        <Lbl C={C}>Rasgo de Carácter</Lbl><Sel options={["Curioso","Compasivo","Responsable","Íntegro","Resiliente"]} value={ras} onChange={setRas} C={C}/>
        <Lbl C={C}>Momento Pedagógico</Lbl><Sel options={["Primera vez en el tema","Profundización","Cierre de unidad"]} value={ctx} onChange={setCtx} C={C}/>
        <InfoBox C={C}>🌟 <strong>Modelo CAR:</strong> Considerar → Actuar → Reflexionar. Protocolo institucional del Ecosistema para el desarrollo del Carácter.</InfoBox>
      </div>
      <OutputPanel prompt={prompt} fmt={fmt} setFmt={setFmt} tipo="prompt" marca={marca} C={C} tab="Competencias" carrera={carrera}/>
    </div>
  );
}

