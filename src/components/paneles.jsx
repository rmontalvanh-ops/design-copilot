import { useState, useRef, useEffect, useCallback } from "react";
import { Copy, X, Send, History, Trash2, Download } from "lucide-react";
import { consultarIA } from "../services/ia";
import { descargarMd } from "../utils/formato";
import { mGet, mSet } from "../utils/memoria";

// ── SPRINT B: HISTORIAL ───────────────────────────────────────────────────────
export function Historial({open,onClose,C}) {
  const [items,setItems]=useState([]);
  useEffect(()=>{if(open)setItems(mGet("hist")||[]);},[open]);
  const del=(id)=>{const n=items.filter(i=>i.id!==id);mSet("hist",n);setItems(n);};
  if(!open) return null;
  return (
    <div style={{position:"fixed",left:0,top:0,bottom:0,width:340,background:"#fff",boxShadow:"4px 0 24px rgba(0,0,0,0.14)",zIndex:999,display:"flex",flexDirection:"column",fontFamily:"Poppins,sans-serif"}}>
      <div style={{background:C.primary,padding:"14px 16px",display:"flex",justifyContent:"space-between",alignItems:"center"}}>
        <div><div style={{color:"rgba(255,255,255,0.55)",fontSize:9,letterSpacing:1.5,textTransform:"uppercase"}}>Memoria</div><div style={{color:"#fff",fontWeight:700,fontSize:14,display:"flex",alignItems:"center",gap:6}}><History size={13}/> Historial</div></div>
        <button onClick={onClose} style={{background:"rgba(255,255,255,0.14)",border:"none",borderRadius:5,padding:"5px 9px",cursor:"pointer",color:"#fff"}}><X size={13}/></button>
      </div>
      <div style={{flex:1,overflowY:"auto",padding:11,display:"flex",flexDirection:"column",gap:8}}>
        {items.length===0&&<div style={{color:C.muted,fontSize:12.5,textAlign:"center",marginTop:36,lineHeight:1.7}}>No hay prompts guardados aún.<br/>Genera un prompt para que aparezca aquí.</div>}
        {items.map(item=>(
          <div key={item.id} style={{border:`1px solid ${C.border}`,borderRadius:8,overflow:"hidden"}}>
            <div style={{padding:"7px 10px",background:C.accentLight,display:"flex",justifyContent:"space-between",alignItems:"center"}}>
              <div><span style={{fontSize:9.5,fontWeight:700,color:C.primary,textTransform:"uppercase"}}>{item.tab}</span>{item.carrera&&<div style={{fontSize:11,color:C.primary,fontWeight:600,marginTop:1}}>{item.carrera}</div>}</div>
              <span style={{fontSize:9,color:C.muted}}>{item.fecha}</span>
            </div>
            <div style={{padding:"8px 10px",background:C.white}}>
              <div style={{fontSize:10.5,color:C.muted,lineHeight:1.5,marginBottom:7}}>{item.preview}...</div>
              <div style={{display:"flex",gap:4}}>
                <button onClick={()=>{const ta=document.createElement("textarea");ta.value=item.prompt;ta.style.cssText="position:fixed;opacity:0";document.body.appendChild(ta);ta.select();document.execCommand("copy");document.body.removeChild(ta);}} style={{flex:1,background:C.primary,color:"#fff",border:"none",borderRadius:5,padding:"6px 0",cursor:"pointer",fontSize:10.5,fontWeight:600,fontFamily:"Poppins,sans-serif",display:"flex",alignItems:"center",justifyContent:"center",gap:4}}><Copy size={10}/> Copiar</button>
                <button onClick={()=>descargarMd(item.prompt,`DCP_${item.tab}_${item.slug||"prompt"}.md`)} style={{flex:1,background:"transparent",border:`1.5px solid ${C.primary}`,borderRadius:5,padding:"6px 0",cursor:"pointer",fontSize:10.5,fontWeight:600,color:C.primary,fontFamily:"Poppins,sans-serif",display:"flex",alignItems:"center",justifyContent:"center",gap:4}}><Download size={10}/> .md</button>
                <button onClick={()=>del(item.id)} style={{background:"transparent",border:`1px solid ${C.danger}`,borderRadius:5,padding:"6px 8px",cursor:"pointer",color:C.danger}}><Trash2 size={10}/></button>
              </div>
            </div>
          </div>
        ))}
      </div>
      {items.length>0&&<div style={{padding:10,borderTop:`1px solid ${C.border}`}}>
        <button onClick={()=>{mSet("hist",[]);setItems([]);}} style={{width:"100%",background:"transparent",border:`1px solid ${C.danger}`,borderRadius:6,padding:"7px 0",cursor:"pointer",fontSize:11,color:C.danger,fontWeight:600,fontFamily:"Poppins,sans-serif",display:"flex",alignItems:"center",justifyContent:"center",gap:4}}><Trash2 size={10}/> Limpiar</button>
      </div>}
    </div>
  );
}

// ── CHAT CONSULTOR ────────────────────────────────────────────────────────────
export function ChatConsultor({open,onClose,marca,C}) {
  const [msgs,setMsgs]=useState([{role:"assistant",content:`¡Hola! Soy el Ecosistema de Aprendizaje de ${marca}. Conozco las 6 Comunalidades Humanas, el Planner institucional, los modelos 3Cs, L2L, GRASPS y el Retrato del Egresado. ¿En qué puedo orientarte?`}]);
  const [inp,setInp]=useState(""); const [carg,setCarg]=useState(false); const endRef=useRef(null);
  useEffect(()=>endRef.current?.scrollIntoView({behavior:"smooth"}),[msgs]);
  const CHIPS=["¿Cuáles son las 6 Comunalidades?","3Cs vs L2L — ¿cuándo usar cada uno?","¿Qué es el Retrato del Egresado?","¿Cómo funciona el modelo GRASPS?","¿Diferencia Planner Grado vs Posgrado?"];
  const enviar=useCallback(async()=>{
    if(!inp.trim()||carg) return;
    const txt=inp; setInp(""); setCarg(true);
    const nm=[...msgs,{role:"user",content:txt}]; setMsgs(nm);
    const r=await consultarIA(nm,marca);
    setMsgs([...nm,{role:"assistant",content:r}]); setCarg(false);
  },[inp,msgs,carg,marca]);
  if(!open) return null;
  return (
    <div style={{position:"fixed",right:0,top:0,bottom:0,width:360,background:"#fff",boxShadow:"-4px 0 24px rgba(0,0,0,0.14)",zIndex:1000,display:"flex",flexDirection:"column",fontFamily:"Poppins,sans-serif"}}>
      <div style={{background:C.primary,padding:"14px 16px",display:"flex",justifyContent:"space-between",alignItems:"center"}}>
        <div><div style={{color:"rgba(255,255,255,0.55)",fontSize:9,letterSpacing:1.5,textTransform:"uppercase"}}>Consultor</div><div style={{color:"#fff",fontWeight:700,fontSize:14}}>💬 Ecosistema</div></div>
        <button onClick={onClose} style={{background:"rgba(255,255,255,0.14)",border:"none",borderRadius:5,padding:"5px 9px",cursor:"pointer",color:"#fff"}}><X size={13}/></button>
      </div>
      <div style={{background:C.accentLight,padding:"6px 12px",fontSize:10,color:C.primary,borderBottom:`1px solid ${C.border}`}}>🛡️ No procesa datos personales. Output es borrador sujeto a validación.</div>
      {msgs.length===1&&<div style={{padding:"8px 10px",display:"flex",flexWrap:"wrap",gap:4,borderBottom:`1px solid ${C.border}`}}>{CHIPS.map((q,i)=><button key={i} onClick={()=>setInp(q)} style={{padding:"3px 8px",borderRadius:20,border:`1px solid ${C.accent}`,background:C.accentLight,color:C.primary,fontSize:10.5,cursor:"pointer",fontFamily:"Poppins,sans-serif"}}>💡 {q}</button>)}</div>}
      <div style={{flex:1,overflowY:"auto",padding:12,display:"flex",flexDirection:"column",gap:7}}>
        {msgs.map((m,i)=><div key={i} style={{background:m.role==="user"?C.accentLight:"#F8FAFF",borderRadius:8,padding:"8px 11px",fontSize:12,lineHeight:1.6,color:"#1A2340",border:`1px solid ${m.role==="user"?C.accent:C.border}`,alignSelf:m.role==="user"?"flex-end":"flex-start",maxWidth:"92%",whiteSpace:"pre-wrap"}}><strong style={{color:C.primary,fontSize:9.5}}>{m.role==="user"?"Tú":"Ecosistema"}</strong><br/>{m.content}</div>)}
        {carg&&<div style={{color:C.muted,fontSize:11,fontStyle:"italic"}}>Consultando Ecosistema...</div>}
        <div ref={endRef}/>
      </div>
      <div style={{padding:10,borderTop:`1px solid ${C.border}`,display:"flex",gap:5}}>
        <input value={inp} onChange={e=>setInp(e.target.value)} onKeyDown={e=>e.key==="Enter"&&enviar()} placeholder="Pregunta al Ecosistema..." style={{flex:1,padding:"8px 10px",borderRadius:7,border:`1.5px solid ${C.border}`,fontFamily:"Poppins,sans-serif",fontSize:12,outline:"none"}}/>
        <button onClick={enviar} disabled={carg} style={{background:C.primary,color:"#fff",border:"none",borderRadius:7,padding:"8px 12px",cursor:"pointer"}}><Send size={12}/></button>
      </div>
    </div>
  );
}

