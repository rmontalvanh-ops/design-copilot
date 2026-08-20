import { useState } from "react";
import { FmtBtns, Terminal } from "../components/Terminal";
import { iS } from "../components/atomos";
import { AccionButtons, Validador } from "../components/salida";
import { FUENTES, PIE } from "../data/ecosistema";
import { convertir } from "../utils/formato";

// ── SPRINT D: PANEL COMPARADOR ────────────────────────────────────────────────
export const CAMPOS_METOD = {
  "3Cs":[["Conectar","¿Cómo conectar el tema con experiencia previa?"],["Construir","¿Qué actividad central de construcción propones?"],["Contribuir","¿Cómo contribuirán los estudiantes?"]],
  "L2L":[["Meta de Aprendizaje","¿Qué habilidad metacognitiva desarrollarán?"],["Estrategia Metacognitiva","¿Qué técnica de autorregulación usarán?"],["Reflexión L2L","¿Cómo documentarán su proceso?"]],
  "5Es":[["Engage","Dinámica de enganche"],["Explore","Actividad de exploración"],["Explain","Momento de conceptualización"],["Elaborate","Aplicación y profundización"],["Evaluate","Evaluación formativa"]],
  "GRASPS":[["Goal","Meta auténtica"],["Role","Rol profesional simulado"],["Audience","Audiencia real"],["Situation","Escenario del mundo real"],["Product","Producto o entregable"],["Standards","Criterios de éxito"]]
};

export function generarPromptMetod(metod, campos, carrera, asig, tiempo, marca) {
  if(!carrera||!metod) return "";
  return `# PROMPT — METODOLOGÍA ACTIVA ${metod}\n## ${marca} · ${carrera}\n\n**Asignatura/Tema:** ${asig||"[Asig]"} · **Tiempo:** ${tiempo||"[Tiempo]"}\n\n**DISEÑO (${metod}):**\n${(CAMPOS_METOD[metod]||[]).map(([k])=>`${k}: ${campos[k]||`[${k}]`}`).join("\n")}\n\n**TAREA:** Genera secuencia completa:\n1. Nombre creativo · 2. Objetivos (técnico + filamento Ecosistema)\n3. Secuencia para ${tiempo||"el tiempo"} · 4. Rol docente Human in the Loop\n5. Toolkit del Ecosistema · 6. Rúbrica (Emergente → En Expansión)\n7. Formato LMS · 8. Instrucción de iteración semanal con ${metod}\n\n**FUENTES:** ${FUENTES}\n${PIE(marca)}`;
}

export function ComparadorPanel({carrera,asig,tiempo,marca,C,onUsar}) {
  const [campos3cs,setCampos3cs]=useState({});
  const [camposL2L,setCamposL2L]=useState({});
  const [fmt,setFmt]=useState("markdown");

  const p3cs = generarPromptMetod("3Cs",campos3cs,carrera,asig,tiempo,marca);
  const pL2L = generarPromptMetod("L2L",camposL2L,carrera,asig,tiempo,marca);

  const setC3=(k,v)=>setCampos3cs(p=>({...p,[k]:v}));
  const setCL=(k,v)=>setCamposL2L(p=>({...p,[k]:v}));

  return (
    <div style={{display:"flex",flexDirection:"column",height:"calc(100vh - 310px)",overflow:"hidden"}}>
      {/* Barra de formato compartida */}
      <div style={{padding:"10px 16px",background:C.white,borderBottom:`1px solid ${C.border}`,display:"flex",alignItems:"center",gap:10,flexWrap:"wrap"}}>
        <span style={{fontSize:11,fontWeight:700,color:C.primary}}>⚡ Modo Comparador · Formato compartido:</span>
        <FmtBtns fmt={fmt} setFmt={setFmt} C={C}/>
      </div>

      {/* Dos columnas */}
      <div className="dcp-grid" style={{flex:1,overflow:"hidden",gap:0}}>

        {/* COLUMNA 3Cs */}
        <div style={{display:"flex",flexDirection:"column",borderRight:`2px solid ${C.border}`,overflow:"hidden"}}>
          <div style={{background:`${C.primary}`,padding:"8px 14px",display:"flex",alignItems:"center",justifyContent:"space-between"}}>
            <span style={{color:"#fff",fontWeight:700,fontSize:13}}>⚡ Modelo 3Cs</span>
            <span style={{color:"rgba(255,255,255,0.7)",fontSize:10}}>Conectar → Construir → Contribuir</span>
          </div>
          <div style={{flex:1,display:"grid",gridTemplateRows:"1fr",overflow:"hidden"}}>
            <div style={{display:"grid",gridTemplateColumns:"220px 1fr",overflow:"hidden"}}>
              {/* Campos 3Cs */}
              <div style={{padding:"12px",overflowY:"auto",borderRight:`1px solid ${C.border}`,background:C.white}}>
                {(CAMPOS_METOD["3Cs"]||[]).map(([k,d])=>(
                  <div key={k}>
                    <label style={{display:"block",fontWeight:600,color:C.primary,fontSize:11,marginBottom:3,marginTop:8}}>{k}</label>
                    <input value={campos3cs[k]||""} onChange={e=>setC3(k,e.target.value)} placeholder={d} style={{...iS(C),fontSize:11.5,padding:"6px 9px"}}/>
                  </div>
                ))}
                {p3cs&&(
                  <button onClick={()=>onUsar("3Cs",campos3cs)} style={{marginTop:12,width:"100%",background:C.primary,color:"#fff",border:"none",borderRadius:7,padding:"8px 0",cursor:"pointer",fontSize:11.5,fontWeight:700,fontFamily:"Poppins,sans-serif"}}>
                    ✅ Usar 3Cs →
                  </button>
                )}
              </div>
              {/* Terminal 3Cs */}
              <div style={{padding:"10px",overflowY:"auto",background:C.bg,display:"flex",flexDirection:"column",gap:6}}>
                <Terminal contenido={convertir(p3cs,fmt)} C={C} compact marca={marca} titulo="Metodología 3Cs"/>
                {p3cs&&<>
                  <AccionButtons texto={p3cs} fmt={fmt} C={C} tab="3Cs" carrera={carrera} compact/>
                  <Validador prompt={p3cs} marca={marca} C={C} compact/>
                </>}
              </div>
            </div>
          </div>
        </div>

        {/* COLUMNA L2L */}
        <div style={{display:"flex",flexDirection:"column",overflow:"hidden"}}>
          <div style={{background:`${C.accent}`,padding:"8px 14px",display:"flex",alignItems:"center",justifyContent:"space-between"}}>
            <span style={{color:"#fff",fontWeight:700,fontSize:13}}>🧠 Modelo L2L</span>
            <span style={{color:"rgba(255,255,255,0.85)",fontSize:10}}>Deconstruir → Identificar → Practicar</span>
          </div>
          <div style={{flex:1,display:"grid",overflow:"hidden"}}>
            <div style={{display:"grid",gridTemplateColumns:"220px 1fr",overflow:"hidden"}}>
              {/* Campos L2L */}
              <div style={{padding:"12px",overflowY:"auto",borderRight:`1px solid ${C.border}`,background:C.white}}>
                {(CAMPOS_METOD["L2L"]||[]).map(([k,d])=>(
                  <div key={k}>
                    <label style={{display:"block",fontWeight:600,color:C.primary,fontSize:11,marginBottom:3,marginTop:8}}>{k}</label>
                    <input value={camposL2L[k]||""} onChange={e=>setCL(k,e.target.value)} placeholder={d} style={{...iS(C),fontSize:11.5,padding:"6px 9px"}}/>
                  </div>
                ))}
                {pL2L&&(
                  <button onClick={()=>onUsar("L2L",camposL2L)} style={{marginTop:12,width:"100%",background:C.accent,color:"#fff",border:"none",borderRadius:7,padding:"8px 0",cursor:"pointer",fontSize:11.5,fontWeight:700,fontFamily:"Poppins,sans-serif"}}>
                    ✅ Usar L2L →
                  </button>
                )}
              </div>
              {/* Terminal L2L */}
              <div style={{padding:"10px",overflowY:"auto",background:C.bg,display:"flex",flexDirection:"column",gap:6}}>
                <Terminal contenido={convertir(pL2L,fmt)} C={C} compact marca={marca} titulo="Learning to Learn"/>
                {pL2L&&<>
                  <AccionButtons texto={pL2L} fmt={fmt} C={C} tab="L2L" carrera={carrera} compact/>
                  <Validador prompt={pL2L} marca={marca} C={C} compact/>
                </>}
              </div>
            </div>
          </div>
        </div>

      </div>
    </div>
  );
}

