import { useState, useCallback } from "react";
import { BookOpen, Zap, Star, Bot, BarChart2, Users, RefreshCw, GraduationCap, MessageCircle, History } from "lucide-react";
import { ChatConsultor, Historial } from "./components/paneles";
import { Validador } from "./components/salida";
import { NOMBRES, PAL } from "./data/ecosistema";
import { TabAgentes } from "./tabs/TabAgentes";
import { TabCompetencias } from "./tabs/TabCompetencias";
import { TabExperiencias } from "./tabs/TabExperiencias";
import { TabGestion } from "./tabs/TabGestion";
import { TabMetodologias } from "./tabs/TabMetodologias";
import { TabPlanIA } from "./tabs/TabPlanIA";
import { TabRubricas } from "./tabs/TabRubricas";
import { mGet } from "./utils/memoria";

// ── APP PRINCIPAL ─────────────────────────────────────────────────────────────
export default function App() {
  const [marca,setMarca]=useState("UNITEC");
  const [tab,setTab]=useState("planIA");
  const [polOpen,setPolOpen]=useState(false);
  const [chatOpen,setChatOpen]=useState(false);
  const [histOpen,setHistOpen]=useState(false);
  const [histCount,setHistCount]=useState(0);
  const C=PAL[marca];
  const actualizarConteo=useCallback(()=>setHistCount((mGet("hist")||[]).length),[]);
  const TABS_A=[{id:"planIA",label:"PlanIA",ic:<BookOpen size={11}/>},{id:"experiencias",label:"Experiencias",ic:<Zap size={11}/>},{id:"metodologias",label:"Metodologías",ic:<RefreshCw size={11}/>}];
  const TABS_B=[{id:"rubricas",label:"Rúbricas",ic:<Star size={11}/>},{id:"competencias",label:"Competencias",ic:<Users size={11}/>},{id:"agentes",label:"Agentes IA",ic:<Bot size={11}/>},{id:"gestion",label:"Gestión",ic:<BarChart2 size={11}/>}];
  const tS=(id)=>({padding:"8px 12px",border:"none",background:tab===id?C.white:"transparent",color:tab===id?C.primary:"rgba(255,255,255,0.7)",fontWeight:tab===id?700:500,fontSize:12,cursor:"pointer",borderRadius:tab===id?"7px 7px 0 0":"0",display:"flex",alignItems:"center",gap:5,fontFamily:"Poppins,sans-serif",whiteSpace:"nowrap",borderBottom:tab===id?`3px solid ${C.primary}`:"none"});
  const props={marca,C,onSave:actualizarConteo};
  return (
    <div style={{fontFamily:"Poppins,sans-serif",background:C.bg,minHeight:"100vh"}}>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Poppins:wght@300;400;500;600;700;800&display=swap');
        *{box-sizing:border-box;}
        select,input,textarea,button{font-family:Poppins,sans-serif;}

        /* Fase 1 UI/UX — estados y layout responsive, tokens en src/styles/tokens.js */
        :root{ --dcp-focus: ${C.accent}; }

        .dcp-field{ transition: border-color 150ms ease, box-shadow 150ms ease; }
        .dcp-field:hover{ border-color: var(--dcp-focus); }
        .dcp-field:focus{ border-color: var(--dcp-focus); box-shadow: 0 0 0 3px ${C.accent}33; }

        .dcp-btn{ transition: transform 150ms ease, opacity 150ms ease, box-shadow 150ms ease; }
        .dcp-btn:hover{ opacity: 0.9; }
        .dcp-btn:active{ transform: scale(0.97); }
        .dcp-btn:focus-visible{ outline: 2px solid var(--dcp-focus); outline-offset: 2px; }

        /* Layout de panel en espejo: colapsa a una columna en pantallas angostas
           (laptops de 13" con el historial abierto, tablets) en vez de aplastarse. */
        .dcp-grid{ display:grid; grid-template-columns: 1fr 1fr; }
        @media (max-width: 900px){ .dcp-grid{ grid-template-columns: 1fr; } }
      `}</style>
      {/* HEADER */}
      <div style={{background:`linear-gradient(135deg,${C.primary} 0%,${C.accent} 100%)`}}>
        <div style={{padding:"14px 16px 0"}}>
          <div style={{display:"flex",justifyContent:"space-between",alignItems:"flex-start",marginBottom:9,flexWrap:"wrap",gap:6}}>
            <div style={{display:"flex",alignItems:"center",gap:10}}>
              <div style={{background:"rgba(255,255,255,0.13)",borderRadius:8,padding:8,border:"1.5px solid rgba(255,255,255,0.18)"}}><GraduationCap size={20} color="rgba(255,255,255,0.9)"/></div>
              <div>
                <div style={{color:"rgba(255,255,255,0.55)",fontSize:8.5,letterSpacing:2.5,textTransform:"uppercase",fontWeight:600}}>{NOMBRES[marca]} · Innovación Educativa</div>
                <h1 style={{margin:0,color:"#fff",fontSize:16,fontWeight:800,lineHeight:1.2}}>Design Co-Pilot <span style={{color:"rgba(255,255,255,0.62)",fontWeight:400}}>· System Prompt Maestro</span></h1>
                <div style={{display:"flex",gap:3,marginTop:2,flexWrap:"wrap"}}>
                  {["Sprint A · Validador","Sprint B · Memoria","Sprint C · Exportar .md","Sprint D · Comparador 3Cs/L2L","Sprint F · Modo Presentación","6 Comunalidades Oficiales"].map(t=><span key={t} style={{background:"rgba(255,255,255,0.11)",color:"rgba(255,255,255,0.72)",fontSize:7.5,padding:"1px 6px",borderRadius:9,fontWeight:600}}>{t}</span>)}
                </div>
              </div>
            </div>
            <div style={{display:"flex",gap:4,alignItems:"center",flexWrap:"wrap"}}>
              {["UNITEC","CEUTEC"].map(m=><button key={m} onClick={()=>setMarca(m)} style={{padding:"6px 12px",borderRadius:6,border:"2px solid rgba(255,255,255,0.35)",background:marca===m?"rgba(255,255,255,0.92)":"transparent",color:marca===m?C.primary:"#fff",fontWeight:700,fontSize:11,cursor:"pointer",transition:"all 0.15s"}}>💎 {m}</button>)}
              <button onClick={()=>{setHistOpen(!histOpen);setChatOpen(false);}} style={{padding:"6px 10px",borderRadius:6,border:"2px solid rgba(255,255,255,0.35)",background:histOpen?"rgba(255,255,255,0.16)":"transparent",color:"#fff",fontWeight:600,fontSize:11,cursor:"pointer",display:"flex",alignItems:"center",gap:4}}>
                <History size={11}/> Historial {histCount>0&&<span style={{background:C.accent,color:"#fff",borderRadius:"50%",width:14,height:14,display:"inline-flex",alignItems:"center",justifyContent:"center",fontSize:8.5,fontWeight:700}}>{histCount}</span>}
              </button>
              <button onClick={()=>{setChatOpen(!chatOpen);setHistOpen(false);}} style={{padding:"6px 10px",borderRadius:6,border:"2px solid rgba(255,255,255,0.35)",background:chatOpen?"rgba(255,255,255,0.16)":"transparent",color:"#fff",fontWeight:600,fontSize:11,cursor:"pointer",display:"flex",alignItems:"center",gap:4}}><MessageCircle size={11}/> Consultor</button>
            </div>
          </div>
          {/* Política */}
          <div onClick={()=>setPolOpen(!polOpen)} style={{background:"rgba(255,255,255,0.09)",borderLeft:"3px solid rgba(255,255,255,0.4)",padding:"6px 12px",borderRadius:"0 5px 5px 0",cursor:"pointer",display:"flex",justifyContent:"space-between",alignItems:"center"}}>
            <span style={{fontSize:10.5,color:"rgba(255,255,255,0.82)",fontWeight:500}}>🛡️ Política PG-IA-002 · Human in the Loop · Protección Nivel 3-4 · {polOpen?"▲":"▼"}</span>
          </div>
          {polOpen&&<div style={{background:"rgba(255,255,255,0.95)",borderRadius:"0 0 7px 7px",padding:"10px 14px",fontSize:11,color:C.primary,lineHeight:1.7}}>
            <strong>Política PG-IA-002 · {NOMBRES[marca]}</strong><br/>
            • No uses cuentas personales · No subas datos Nivel 3-4 (personales, médicos, legales, expedientes)<br/>
            • <strong>Human in the Loop:</strong> el docente valida siempre · Todo output es borrador<br/>
            • No ocultes el uso de IA · El docente es autor responsable
          </div>}
          {/* Tabs */}
          <div style={{marginTop:8}}>
            <div style={{fontSize:7.5,color:"rgba(255,255,255,0.38)",fontWeight:700,letterSpacing:2,textTransform:"uppercase",marginBottom:2,paddingLeft:1}}>Zona A — Diseño Curricular</div>
            <div style={{display:"flex",gap:2}}>{TABS_A.map(t=><button key={t.id} onClick={()=>setTab(t.id)} style={tS(t.id)}>{t.ic}{t.label}</button>)}</div>
            <div style={{fontSize:7.5,color:"rgba(255,255,255,0.38)",fontWeight:700,letterSpacing:2,textTransform:"uppercase",marginBottom:2,paddingLeft:1,marginTop:4}}>Zona B — Herramientas Docentes</div>
            <div style={{display:"flex",gap:2}}>{TABS_B.map(t=><button key={t.id} onClick={()=>setTab(t.id)} style={tS(t.id)}>{t.ic}{t.label}</button>)}</div>
          </div>
        </div>
      </div>
      {/* Contenido */}
      <div style={{background:C.white,boxShadow:"0 2px 10px rgba(0,0,0,0.05)"}}>
        {tab==="planIA"&&<TabPlanIA {...props}/>}
        {tab==="experiencias"&&<TabExperiencias {...props}/>}
        {tab==="metodologias"&&<TabMetodologias {...props}/>}
        {tab==="rubricas"&&<TabRubricas {...props}/>}
        {tab==="competencias"&&<TabCompetencias {...props}/>}
        {tab==="agentes"&&<TabAgentes marca={marca} C={C}/>}
        {tab==="gestion"&&<TabGestion {...props}/>}
      </div>
      {/* Footer */}
      <div style={{textAlign:"center",padding:"10px",color:C.muted,fontSize:9.5,borderTop:`1px solid ${C.border}`,background:C.bg}}>
        Design Co-Pilot · System Prompt Maestro v3.4 · {NOMBRES[marca]} · Ecosistema de Aprendizaje · 2025–2026
      </div>
      <Historial open={histOpen} onClose={()=>setHistOpen(false)} C={C}/>
      <ChatConsultor open={chatOpen} onClose={()=>setChatOpen(false)} marca={marca} C={C}/>
    </div>
  );
}
