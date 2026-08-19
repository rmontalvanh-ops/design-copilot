import { useState, useEffect, useCallback } from "react";
import { Columns } from "lucide-react";
import { CAMPOS_METOD, ComparadorPanel, generarPromptMetod } from "../components/Comparador";
import { CarreraSelect, InfoBox, Inp, Sel } from "../components/atomos";
import { OutputPanel } from "../components/salida";
import { guardarHist } from "../utils/memoria";

// ── TAB 3: METODOLOGÍAS (con Sprint D) ───────────────────────────────────────
export function TabMetodologias({marca,C,onSave}) {
  const [carrera,setCarrera]=useState(""); const [asig,setAsig]=useState("");
  const [metod,setMetod]=useState(""); const [tiempo,setTiempo]=useState("");
  const [campos,setCampos]=useState({}); const [fmt,setFmt]=useState("markdown");
  const [comparar,setComparar]=useState(false);

  const prompt=generarPromptMetod(metod,campos,carrera,asig,tiempo,marca);

  useEffect(()=>{
    if(carrera&&metod&&prompt.length>80){guardarHist("Metodologías",carrera,prompt);onSave();}
  },[prompt,carrera,metod]);

  // Cuando el docente elige una metodología del comparador
  const usarDesdeComparador=useCallback((metodElegida, camposElegidos)=>{
    setMetod(metodElegida);
    setCampos(camposElegidos);
    setComparar(false);
  },[]);

  return (
    <div style={{height:"calc(100vh - 240px)",display:"flex",flexDirection:"column"}}>
      {/* Barra de controles compartidos + toggle comparar */}
      <div style={{padding:"12px 18px",background:C.white,borderBottom:`1px solid ${C.border}`,display:"flex",gap:12,alignItems:"flex-end",flexWrap:"wrap"}}>
        <div style={{flex:"1 1 180px"}}>
          <label style={{display:"block",fontWeight:600,color:C.primary,fontSize:12,marginBottom:4}}>Carrera</label>
          <CarreraSelect marca={marca} value={carrera} onChange={setCarrera} C={C}/>
        </div>
        <div style={{flex:"2 1 240px"}}>
          <label style={{display:"block",fontWeight:600,color:C.primary,fontSize:12,marginBottom:4}}>Asignatura y Tema</label>
          <Inp placeholder="Ej: Circuitos — Compuertas Lógicas" value={asig} onChange={setAsig} C={C}/>
        </div>
        <div style={{flex:"1 1 160px"}}>
          <label style={{display:"block",fontWeight:600,color:C.primary,fontSize:12,marginBottom:4}}>Tiempo Disponible</label>
          <Sel options={["Sesión de 90 min","Tarea de 1 semana","Proyecto de medio trimestre"]} value={tiempo} onChange={setTiempo} C={C}/>
        </div>
        {/* Toggle Comparar */}
        <div style={{flexShrink:0}}>
          <button onClick={()=>setComparar(!comparar)} style={{padding:"9px 16px",borderRadius:8,border:`2px solid ${comparar?C.accent:C.primary}`,background:comparar?C.accent:C.white,color:comparar?"#fff":C.primary,fontWeight:700,fontSize:12,cursor:"pointer",fontFamily:"Poppins,sans-serif",display:"flex",alignItems:"center",gap:6,transition:"all 0.2s"}}>
            <Columns size={14}/>{comparar?"▶ Modo Normal":"⚡ Comparar 3Cs vs L2L"}
          </button>
        </div>
      </div>

      {comparar
        /* ── MODO COMPARADOR ── */
        ? <ComparadorPanel carrera={carrera} asig={asig} tiempo={tiempo} marca={marca} C={C} onUsar={usarDesdeComparador}/>
        /* ── MODO NORMAL ── */
        : <div style={{flex:1,display:"grid",gridTemplateColumns:"280px 1fr",overflow:"hidden"}}>
            {/* Panel izquierdo — metodología específica */}
            <div style={{padding:"14px 16px",overflowY:"auto",borderRight:`1px solid ${C.border}`,background:C.white}}>
              <label style={{display:"block",fontWeight:600,color:C.primary,fontSize:12.5,marginBottom:4}}>Metodología del Ecosistema</label>
              <Sel options={["3Cs","L2L","5Es","GRASPS"]} value={metod} onChange={v=>{setMetod(v);setCampos({});}} C={C}/>
              {metod&&<div style={{marginTop:10,padding:10,background:C.accentLight,borderRadius:7,border:`1px solid ${C.border}`}}>
                <div style={{fontSize:9.5,fontWeight:700,color:C.primary,textTransform:"uppercase",letterSpacing:1,marginBottom:6}}>Campos {metod}</div>
                {(CAMPOS_METOD[metod]||[]).map(([k,d])=>(
                  <div key={k}>
                    <label style={{display:"block",fontWeight:600,color:C.primary,fontSize:11.5,marginBottom:3,marginTop:8}}>{k}</label>
                    <Inp placeholder={d} value={campos[k]||""} onChange={v=>setCampos(p=>({...p,[k]:v}))} C={C}/>
                  </div>
                ))}
              </div>}
              {!metod&&<InfoBox C={C}>💡 Selecciona una metodología o usa <strong>⚡ Comparar 3Cs vs L2L</strong> para ver ambos prompts lado a lado y elegir el que mejor se adapte a tu clase.</InfoBox>}
            </div>
            {/* Panel derecho — output */}
            <OutputPanel prompt={prompt} fmt={fmt} setFmt={setFmt} tipo="prompt" marca={marca} C={C} tab="Metodologias" carrera={carrera}/>
          </div>
      }
    </div>
  );
}

