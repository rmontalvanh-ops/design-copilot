import { useState, useCallback, useRef } from "react";
import { Upload, FileText, X, AlertCircle } from "lucide-react";
import { InfoBox, Lbl } from "../components/atomos";
import { ValidadorRedaccion } from "../components/ValidadorRedaccion";
import { extraerTexto } from "../utils/lectorArchivos";
import { T, estiloCampo } from "../styles/tokens";

// ── TAB 7: GESTIÓN ────────────────────────────────────────────────────────────
// Simplificado: el Generador de Protocolo de Auditoría se retiró (decisión de
// Rafael). Queda un único propósito — auditar la redacción de un Planner ya
// escrito contra las 12 reglas locales del Ecosistema (Sprint H).
export function TabGestion({marca,C,onSave}) {
  const [textoPlanner,setTextoPlanner]=useState("");
  const [archivo,setArchivo]=useState(null);
  const [cargando,setCargando]=useState(false);
  const [errorArchivo,setErrorArchivo]=useState("");
  const inputRef=useRef(null);

  const procesarArchivo=useCallback(async(file)=>{
    if(!file) return;
    setErrorArchivo(""); setCargando(true);
    try{
      const texto=await extraerTexto(file);
      setTextoPlanner(texto);
      setArchivo(file.name);
      onSave();
    }catch(e){
      setErrorArchivo(e.message||"No se pudo leer el archivo.");
      setArchivo(null);
    }finally{
      setCargando(false);
    }
  },[onSave]);

  const limpiar=useCallback(()=>{
    setArchivo(null); setTextoPlanner(""); setErrorArchivo("");
    if(inputRef.current) inputRef.current.value="";
  },[]);

  return (
    <div style={{padding:T.space.lg}}>
      <div style={{background:C.accentLight,border:`1px solid ${C.accent}`,borderRadius:T.radius.md,padding:`${T.space.sm}px ${T.space.md}px`,marginBottom:T.space.lg,fontSize:T.font.small,color:C.primary}}>
        🔐 <strong>Exclusivo:</strong> Jefes de Carrera y Decanos. Subí el Planner de un docente (.pdf o .docx) o pegá su texto para chequear las 12 reglas de redacción del Ecosistema — el archivo se procesa en tu navegador, nunca se envía a ningún servidor.
      </div>

      <Lbl C={C}>Subir Planner</Lbl>
      <div
        onDragOver={e=>e.preventDefault()}
        onDrop={e=>{e.preventDefault(); procesarArchivo(e.dataTransfer.files[0]);}}
        style={{border:`1.5px dashed ${C.border}`,borderRadius:T.radius.md,padding:`${T.space.lg}px`,textAlign:"center",background:C.white,cursor:"pointer"}}
        onClick={()=>inputRef.current?.click()}
      >
        <input ref={inputRef} type="file" accept=".pdf,.docx,.doc,.txt,.md" style={{display:"none"}} onChange={e=>procesarArchivo(e.target.files[0])}/>
        {cargando ? (
          <div style={{color:C.muted,fontSize:T.font.body}}>Leyendo archivo...</div>
        ) : archivo ? (
          <div style={{display:"flex",alignItems:"center",justifyContent:"center",gap:T.space.sm,color:C.primary,fontWeight:600,fontSize:T.font.body}}>
            <FileText size={16}/> {archivo}
            <button onClick={e=>{e.stopPropagation(); limpiar();}} className="dcp-btn" style={{background:"none",border:"none",cursor:"pointer",color:C.muted,display:"flex"}}><X size={14}/></button>
          </div>
        ) : (
          <div style={{color:C.muted,fontSize:T.font.body,display:"flex",flexDirection:"column",alignItems:"center",gap:T.space.xs}}>
            <Upload size={20}/>
            Arrastrá el archivo aquí o hacé click para elegirlo
            <span style={{fontSize:T.font.tiny}}>.pdf o .docx</span>
          </div>
        )}
      </div>

      {errorArchivo && (
        <div style={{display:"flex",gap:T.space.xs,alignItems:"flex-start",marginTop:T.space.sm,fontSize:T.font.small,color:C.danger||"#B00020"}}>
          <AlertCircle size={14}/> {errorArchivo}
        </div>
      )}

      <div style={{textAlign:"center",color:C.muted,fontSize:T.font.tiny,margin:`${T.space.md}px 0`}}>— o pegá el texto directamente —</div>

      <Lbl C={C}>Texto del Planner a auditar</Lbl>
      <textarea
        className="dcp-field"
        value={textoPlanner}
        onChange={e=>{setTextoPlanner(e.target.value); setArchivo(null);}}
        placeholder="Pegá aquí el contenido completo del Planner (Gran Idea, Historia, Metas, GRASPS, Secuencias, Rúbrica, Retrato)..."
        style={{...estiloCampo(C),minHeight:220,resize:"vertical",lineHeight:1.6}}
      />
      <ValidadorRedaccion texto={textoPlanner} C={C}/>
      {!textoPlanner.trim() && (
        <InfoBox C={C}>💡 El diagnóstico corre localmente — cubre los 3 errores más frecuentes documentados por el Decano de Innovación Educativa, incluida la regla de opciones de producto en GRASPS con 100% de incidencia observada.</InfoBox>
      )}
    </div>
  );
}
