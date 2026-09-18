import { useState, useCallback, memo } from "react";
import { Copy, Check, Shield, ChevronDown, ChevronUp, CheckCircle, AlertCircle, Link, RotateCcw, Download } from "lucide-react";
import { FmtBtns, Terminal } from "../components/Terminal";
import { convertir, copiarTexto, descargarMd } from "../utils/formato";

// ── BOTONES ACCIÓN ────────────────────────────────────────────────────────────
export function AccionButtons({texto,fmt,copilot=false,C,tab="",carrera="",compact=false,completo=true}) {
  const [copiado,setCopiado]=useState(false);
  const contenidoFinal = copilot?texto:convertir(texto,fmt);
  const copiar=useCallback(()=>{
    copiarTexto(contenidoFinal,()=>{setCopiado(true);setTimeout(()=>setCopiado(false),2000);});
  },[contenidoFinal]);
  const descargar=useCallback(()=>{
    if(!texto) return;
    const fecha=new Date().toISOString().split("T")[0];
    const slug=carrera.replace(/[^a-zA-Z0-9]/g,"_").slice(0,20)||tab;
    descargarMd(texto,`DCP_${tab}_${slug}_${fecha}.md`);
  },[texto,tab,carrera]);
  if(!texto||texto.length<30) return null;
  const sz=compact?"10px":"12.5px";
  // Sprint E: el botón Copiar pulsa cuando el formulario que lo alimenta llega
  // a 100% de completitud — señal visual de "ya podés copiar con confianza".
  return (
    <div style={{display:"flex",gap:6,marginTop:8,flexWrap:"wrap"}}>
      <button onClick={copiar} className={completo&&!copiado?"dcp-btn-pulso":""} style={{background:copiado?C.success:C.accent,color:"#fff",border:"none",borderRadius:7,padding:compact?"6px 12px":"9px 16px",cursor:"pointer",fontWeight:700,fontSize:sz,display:"flex",alignItems:"center",gap:5,fontFamily:"Poppins,sans-serif",transition:"background 0.2s"}}>
        {copiado?<Check size={11}/>:<Copy size={11}/>}{copiado?"✅ Copiado":copilot?"📋 Copiar para Copilot":`📋 Copiar ${fmt==="markdown"?"MD":fmt==="texto"?"Texto":"HTML"}`}
      </button>
      {!copilot&&<button onClick={descargar} style={{background:"transparent",border:`1.5px solid ${C.primary}`,color:C.primary,borderRadius:7,padding:compact?"6px 10px":"9px 14px",cursor:"pointer",fontWeight:600,fontSize:sz,display:"flex",alignItems:"center",gap:5,fontFamily:"Poppins,sans-serif"}}>
        <Download size={11}/> .md
      </button>}
    </div>
  );
}

// ── SPRINT A: VALIDADOR ───────────────────────────────────────────────────────
export function Validador({prompt,marca,C,compact=false}) {
  const [res,setRes]=useState(null);
  const [loading,setLoad]=useState(false);
  const [open,setOpen]=useState(false);
  const validar=useCallback(async()=>{
    if(!prompt||prompt.length<50) return;
    setLoad(true);setOpen(true);
    await new Promise(r=>setTimeout(r,1400));
    const t=prompt.toLowerCase();
    const checks=[
      {id:"fil",label:"Filamento del Ecosistema",ok:/colaboraci|carácter|caracter|transferencia|learning to learn|l2l/.test(t),tip:"Menciona el filamento que guía esta experiencia."},
      {id:"met",label:"Metodología 3Cs / L2L",ok:/3cs|conectar|construir|contribuir|l2l|learning to learn|5es|grasps|dip|car/.test(t),tip:"Especifica la metodología del Ecosistema."},
      {id:"com",label:"Comunalidad Humana alineada",ok:/propósito|equilibrio|individuos|grupos|historias|señales|imaginación|creatividad|tierra|ecosistema|patrones|principios|comunalidad/.test(t),tip:"Alinea a una de las 6 Comunalidades Humanas."},
      {id:"ret",label:"Retrato del Egresado",ok:/retrato|líder|comunicador|solucionador|ciudadano|colaborador|innovador/.test(t),tip:"Conecta con una capacidad del Retrato del Egresado."},
      {id:"hil",label:"Human in the Loop",ok:/human in the loop|docente valida|borrador|responsable|supervisión|supervision/.test(t),tip:"Incluye que el docente valida el output."},
      {id:"niv",label:"Niveles de logro institucionales",ok:/emergente|evolución|evolucion|experto|expansión|expansion/.test(t),tip:"Referencia los 4 niveles: Emergente → En Expansión."},
      {id:"pol",label:"Política PG-IA-002",ok:/pg-ia|política|politica|autor responsable|autoría|autoria/.test(t),tip:"Incluye la cláusula de autoría y Política PG-IA-002."},
    ];
    const ok=checks.filter(c=>c.ok).length;
    const pct=Math.round((ok/checks.length)*100);
    const nivel=pct>=90?"En Expansión":pct>=70?"Experto":pct>=50?"En Evolución":"Emergente";
    const color=pct>=90?C.success:pct>=70?"#3B82F6":pct>=50?C.warn:C.danger;
    setRes({checks,pct,nivel,color,ok,total:checks.length});
    setLoad(false);
  },[prompt,C]);
  if(!prompt||prompt.length<50) return null;
  return (
    <div style={{marginTop:9,border:`1.5px solid ${C.border}`,borderRadius:10,overflow:"hidden"}}>
      <button onClick={()=>{if(!res)validar();else setOpen(!open);}} style={{width:"100%",padding:"9px 13px",background:res?res.color+"18":C.accentLight,border:"none",cursor:"pointer",display:"flex",alignItems:"center",justifyContent:"space-between",fontFamily:"Poppins,sans-serif"}}>
        <span style={{display:"flex",alignItems:"center",gap:6,fontWeight:700,fontSize:compact?11:12.5,color:res?res.color:C.primary}}>
          <Shield size={13} color={res?res.color:C.primary}/>
          {loading?"Analizando...":res?`Ecosistema · ${res.nivel} · ${res.pct}%`:"Validar Coherencia del Ecosistema"}
        </span>
        {res&&(open?<ChevronUp size={11} color={C.muted}/>:<ChevronDown size={11} color={C.muted}/>)}
      </button>
      {open&&res&&(
        <div style={{padding:"13px",background:C.white}}>
          <div style={{marginBottom:10}}>
            <div style={{display:"flex",justifyContent:"space-between",marginBottom:4}}>
              <span style={{fontSize:11.5,fontWeight:600,color:C.primary}}>Índice de Coherencia</span>
              <span style={{fontSize:12,fontWeight:800,color:res.color}}>{res.pct}% — {res.nivel}</span>
            </div>
            <div style={{height:6,background:C.border,borderRadius:3,overflow:"hidden"}}>
              <div style={{height:"100%",width:`${res.pct}%`,background:res.color,borderRadius:3,transition:"width 0.7s ease"}}/>
            </div>
            <div style={{display:"flex",justifyContent:"space-between",fontSize:8.5,color:C.muted,marginTop:2}}>
              <span>Emergente</span><span>En Evolución</span><span>Experto</span><span>En Expansión</span>
            </div>
          </div>
          <div style={{display:"flex",flexDirection:"column",gap:5}}>
            {res.checks.map(ch=>(
              <div key={ch.id} style={{display:"flex",alignItems:"flex-start",gap:7,padding:"7px 9px",background:ch.ok?`${C.success}10`:`${C.warn}10`,borderRadius:6,border:`1px solid ${ch.ok?C.success+"40":C.warn+"40"}`}}>
                <div style={{flexShrink:0,marginTop:1}}>{ch.ok?<CheckCircle size={12} color={C.success}/>:<AlertCircle size={12} color={C.warn}/>}</div>
                <div><div style={{fontSize:11.5,fontWeight:600,color:ch.ok?C.success:"#92400E"}}>{ch.label}</div>{!ch.ok&&<div style={{fontSize:10.5,color:C.muted,marginTop:1,lineHeight:1.5}}>💡 {ch.tip}</div>}</div>
              </div>
            ))}
          </div>
          <div style={{marginTop:9,padding:"9px 11px",background:res.color+"15",borderRadius:6,border:`1px solid ${res.color}40`,fontSize:11,color:"#1A2340",lineHeight:1.6}}>
            <strong style={{color:res.color}}>📊 {res.ok}/{res.total} criterios del Ecosistema presentes.</strong>{" "}
            {res.pct<50&&"Agrega los elementos faltantes para mayor fidelidad institucional."}
            {res.pct>=50&&res.pct<70&&"Buen inicio — los criterios faltantes mejorarán la alineación."}
            {res.pct>=70&&res.pct<90&&"Bien alineado. Agrega los marcados para alcanzar En Expansión."}
            {res.pct>=90&&"¡Excelente! Refleja fielmente el Ecosistema institucional."}
          </div>
          <button onClick={()=>{setRes(null);setTimeout(validar,50);}} style={{marginTop:8,background:"transparent",border:`1px solid ${C.border}`,borderRadius:5,padding:"4px 9px",cursor:"pointer",fontSize:10,color:C.muted,display:"flex",alignItems:"center",gap:4,fontFamily:"Poppins,sans-serif"}}><RotateCcw size={9}/> Revalidar</button>
        </div>
      )}
      {!res&&!loading&&<div style={{padding:"7px 12px",background:C.bg,fontSize:10.5,color:C.muted}}>Verifica la alineación con Comunalidades, metodologías, Retrato y Política PG-IA-002.</div>}
    </div>
  );
}

// ── PUENTE COPILOT ────────────────────────────────────────────────────────────
export const Puente = memo(({tipo,C}) => {
  const [open,setOpen]=useState(false);
  const G={
    system_prompt:{t:"¿Cómo activar en MS Copilot?",p:["Abre Microsoft Copilot en tu navegador o Teams","Haz clic en 'Instrucciones personalizadas'","Pega este System Prompt como primera instrucción","Escribe: 'Estoy listo. Tema de esta semana: [tema]'"],n:'Próxima semana → mismo chat → "Semana [N]. Tema: [tema]." El agente recuerda todo.'},
    activacion:{t:"¿Cómo usar en Copilot?",p:["Abre el chat donde tienes tu agente configurado","Pega este mensaje directamente","El agente genera la clase automáticamente","Copia el output al LMS elegido"],n:"Repite cada semana en el mismo chat."},
    prompt:{t:"¿Cómo usar este Prompt?",p:["Copia en el formato elegido","Abre Copilot e inicia chat nuevo","Pega y envía el prompt","Valida el output antes de usar en aula"],n:"Human in the Loop: siempre valida antes de publicar."}
  };
  const g=G[tipo]||G.prompt;
  return (
    <div style={{marginTop:8,border:`1px solid ${C.border}`,borderRadius:8,overflow:"hidden"}}>
      <button onClick={()=>setOpen(!open)} style={{width:"100%",padding:"8px 12px",background:C.accentLight,border:"none",cursor:"pointer",display:"flex",alignItems:"center",justifyContent:"space-between",fontFamily:"Poppins,sans-serif"}}>
        <span style={{display:"flex",alignItems:"center",gap:6,fontWeight:600,fontSize:11.5,color:C.primary}}><Link size={11}/>{g.t}</span>
        {open?<ChevronUp size={11} color={C.muted}/>:<ChevronDown size={11} color={C.muted}/>}
      </button>
      {open&&<div style={{padding:"11px 13px",background:C.white}}>
        <div style={{display:"flex",flexDirection:"column",gap:5,marginBottom:9}}>
          {g.p.map((p,i)=>(
            <div key={i} style={{display:"flex",gap:8,alignItems:"flex-start"}}>
              <div style={{width:17,height:17,borderRadius:"50%",background:C.primary,color:"#fff",display:"flex",alignItems:"center",justifyContent:"center",fontSize:9,fontWeight:700,flexShrink:0}}>{i+1}</div>
              <span style={{fontSize:11.5,color:"#1A2340",lineHeight:1.5,paddingTop:1}}>{p}</span>
            </div>
          ))}
        </div>
        <div style={{background:C.accentLight,borderRadius:5,padding:"7px 10px",fontSize:11,color:C.primary,lineHeight:1.6,borderLeft:`3px solid ${C.accent}`}}>🔄 {g.n}</div>
      </div>}
    </div>
  );
});

// ── OUTPUT PANEL ──────────────────────────────────────────────────────────────
export function OutputPanel({prompt,fmt,setFmt,tipo,marca,C,copilot=false,tab="",carrera="",completo=true}) {
  return (
    <div style={{padding:18,overflowY:"auto",background:C.bg}}>
      {!copilot&&<FmtBtns fmt={fmt} setFmt={setFmt} C={C}/>}
      <Terminal contenido={copilot?prompt:convertir(prompt,fmt)} C={C} marca={marca} titulo={tab||tipo}/>
      {prompt&&prompt.length>40&&<>
        <AccionButtons texto={prompt} fmt={fmt} copilot={copilot} C={C} tab={tab} carrera={carrera} completo={completo}/>
        <Puente tipo={tipo} C={C}/>
        {!copilot&&<Validador prompt={prompt} marca={marca} C={C}/>}
      </>}
    </div>
  );
}

