import { useState, useEffect, useCallback, memo } from "react";
import { Copy, Check, X, Maximize2, Plus, Minus } from "lucide-react";
import { NOMBRES } from "../data/ecosistema";
import { copiarTexto } from "../utils/formato";
import { mGet, mSet } from "../utils/memoria";

// ── SPRINT F: MODO PRESENTACIÓN ───────────────────────────────────────────────
export function Presentacion({contenido,C,marca,titulo,onClose}) {
  const [fs,setFs]=useState(mGet("presFs")||24);
  const [copiado,setCopiado]=useState(false);
  const subir=useCallback(()=>setFs(f=>Math.min(f+2,52)),[]);
  const bajar=useCallback(()=>setFs(f=>Math.max(f-2,13)),[]);
  useEffect(()=>{ mSet("presFs",fs); },[fs]);
  useEffect(()=>{
    const onKey=(e)=>{
      if(e.key==="Escape") onClose();
      else if(e.key==="+"||e.key==="=") subir();
      else if(e.key==="-"||e.key==="_") bajar();
    };
    window.addEventListener("keydown",onKey);
    const prevOv=document.body.style.overflow;
    document.body.style.overflow="hidden";
    return ()=>{ window.removeEventListener("keydown",onKey); document.body.style.overflow=prevOv; };
  },[onClose,subir,bajar]);
  const copiar=useCallback(()=>copiarTexto(contenido,()=>{setCopiado(true);setTimeout(()=>setCopiado(false),2000);}),[contenido]);
  const btn={background:"rgba(255,255,255,0.09)",border:"1px solid rgba(255,255,255,0.18)",color:"rgba(255,255,255,0.88)",borderRadius:7,padding:"7px 11px",cursor:"pointer",fontWeight:600,fontSize:12,fontFamily:"Poppins,sans-serif",display:"flex",alignItems:"center",gap:5};
  return (
    <div style={{position:"fixed",inset:0,zIndex:9999,background:C.terminal,display:"flex",flexDirection:"column"}}>
      <div style={{height:4,background:`linear-gradient(90deg,${C.primary} 0%,${C.accent} 100%)`,flexShrink:0}}/>
      {/* Barra de control — lo único visible además de la terminal */}
      <div style={{display:"flex",justifyContent:"space-between",alignItems:"center",gap:10,padding:"12px 22px",borderBottom:"1px solid rgba(255,255,255,0.09)",flexWrap:"wrap",flexShrink:0}}>
        <div>
          <div style={{color:"rgba(255,255,255,0.42)",fontSize:8.5,letterSpacing:2.5,textTransform:"uppercase",fontWeight:700,fontFamily:"Poppins,sans-serif"}}>{NOMBRES[marca]||"Ecosistema de Aprendizaje"} · Modo Presentación</div>
          <div style={{color:"#fff",fontSize:15,fontWeight:700,fontFamily:"Poppins,sans-serif"}}>Design Co-Pilot{titulo?` · ${titulo}`:""}</div>
        </div>
        <div style={{display:"flex",gap:6,alignItems:"center",flexWrap:"wrap"}}>
          <button onClick={bajar} title="Reducir texto (−)" style={btn}><Minus size={12}/></button>
          <span style={{color:"rgba(255,255,255,0.55)",fontSize:11,fontWeight:600,fontFamily:"Poppins,sans-serif",minWidth:44,textAlign:"center"}}>{fs} px</span>
          <button onClick={subir} title="Ampliar texto (+)" style={btn}><Plus size={12}/></button>
          <button onClick={copiar} style={{...btn,background:copiado?C.success:C.accent,border:"none",color:"#fff"}}>{copiado?<Check size={12}/>:<Copy size={12}/>}{copiado?"Copiado":"Copiar"}</button>
          <button onClick={onClose} title="Salir (Esc)" style={{...btn,background:"rgba(255,255,255,0.16)"}}><X size={12}/> Salir</button>
        </div>
      </div>
      {/* Terminal a pantalla completa */}
      <div style={{flex:1,overflowY:"auto",padding:"26px 22px 30px"}}>
        <div style={{maxWidth:1180,margin:"0 auto",fontFamily:"'Courier New',monospace",fontSize:fs,lineHeight:1.7,color:"#A8D8EA",whiteSpace:"pre-wrap",wordBreak:"break-word"}}>
          {contenido||<span style={{opacity:0.28}}>Sin contenido para proyectar todavía.</span>}
        </div>
      </div>
      {/* Gobernanza siempre visible al proyectar ante directivos */}
      <div style={{flexShrink:0,padding:"8px 22px",borderTop:"1px solid rgba(255,255,255,0.09)",display:"flex",justifyContent:"space-between",alignItems:"center",gap:10,flexWrap:"wrap"}}>
        <span style={{color:"rgba(255,255,255,0.38)",fontSize:9.5,fontWeight:600,letterSpacing:0.6,fontFamily:"Poppins,sans-serif"}}>🛡️ Borrador · IA asistida · Política PG-IA-002 · Human in the Loop · El docente es autor responsable</span>
        <span style={{color:"rgba(255,255,255,0.24)",fontSize:9.5,fontFamily:"Poppins,sans-serif"}}>Esc para salir · + / − para el tamaño</span>
      </div>
    </div>
  );
}
export const Terminal = memo(({contenido,C,compact=false,marca,titulo=""}) => {
  const [pres,setPres]=useState(false);
  return (<>
  <div style={{background:C.terminal,borderRadius:10,padding:compact?"34px 13px 13px":"40px 15px 15px",fontFamily:"'Courier New',monospace",fontSize:compact?11:12,lineHeight:1.75,color:"#A8D8EA",whiteSpace:"pre-wrap",wordBreak:"break-word",position:"relative",minHeight:compact?100:130,maxHeight:compact?320:430,overflowY:"auto",border:"1px solid rgba(255,255,255,0.07)"}}>
    <div style={{position:"absolute",top:10,left:12,display:"flex",gap:5,alignItems:"center"}}>
      {["#FF6058","#FFBD2E","#28C840"].map(col=><div key={col} style={{width:9,height:9,borderRadius:"50%",background:col}}/>)}
      <span style={{color:"#3A5A8A",fontSize:9,marginLeft:5,fontFamily:"Poppins,sans-serif"}}>Design Co-Pilot · {compact?"comparador":""}</span>
    </div>
    <button onClick={()=>setPres(true)} title="Modo presentación · pantalla completa" style={{position:"absolute",top:7,right:9,background:"rgba(255,255,255,0.08)",border:"1px solid rgba(255,255,255,0.16)",borderRadius:6,padding:compact?"3px 6px":"4px 8px",cursor:"pointer",color:"rgba(255,255,255,0.66)",display:"flex",alignItems:"center",gap:4,fontSize:9,fontWeight:600,fontFamily:"Poppins,sans-serif"}}>
      <Maximize2 size={compact?9:10}/>{!compact&&"Proyectar"}
    </button>
    {contenido||<span style={{opacity:0.28}}>El prompt aparecerá aquí...</span>}
  </div>
  {pres&&<Presentacion contenido={contenido} C={C} marca={marca} titulo={titulo} onClose={()=>setPres(false)}/>}
  </>);
});
export const FmtBtns = memo(({fmt,setFmt,C}) => (
  <div style={{display:"flex",gap:5,marginBottom:8,alignItems:"center",flexWrap:"wrap"}}>
    <span style={{fontSize:10.5,fontWeight:600,color:C.muted}}>Formato:</span>
    {[["markdown","📝 Markdown"],["texto","📄 Texto"],["html","🌐 HTML/LMS"]].map(([v,l])=>(
      <button key={v} onClick={()=>setFmt(v)} style={{padding:"4px 9px",borderRadius:20,border:`1.5px solid ${C.primary}`,background:fmt===v?C.primary:C.white,color:fmt===v?C.white:C.primary,fontSize:10.5,fontWeight:600,cursor:"pointer",fontFamily:"Poppins,sans-serif"}}>{l}</button>
    ))}
  </div>
));

