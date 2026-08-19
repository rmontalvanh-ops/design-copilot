import { memo } from "react";
import { CARRERAS, COMUNALIDADES } from "../data/ecosistema";

// ── ÁTOMOS ────────────────────────────────────────────────────────────────────
export const iS = (C) => ({width:"100%",padding:"8px 11px",borderRadius:7,border:`1.5px solid ${C.border}`,fontFamily:"Poppins,sans-serif",fontSize:13,color:"#1A2340",background:C.white,boxSizing:"border-box",outline:"none"});
export const Lbl = memo(({C,children}) => <label style={{display:"block",fontWeight:600,color:C.primary,fontSize:12.5,marginBottom:4,marginTop:11}}>{children}</label>);
export const Inp = memo(({placeholder,value,onChange,C,type="text",rows}) => {
  const s=iS(C);
  return rows?<textarea value={value} onChange={e=>onChange(e.target.value)} placeholder={placeholder} rows={rows} style={{...s,resize:"vertical"}}/>:<input type={type} value={value} onChange={e=>onChange(e.target.value)} placeholder={placeholder} style={s}/>;
});
export const Sel = memo(({options,value,onChange,C}) => (
  <select value={value} onChange={e=>onChange(e.target.value)} style={{...iS(C),cursor:"pointer"}}>
    <option value="">— Selecciona —</option>
    {options.map(o=><option key={o} value={o}>{o}</option>)}
  </select>
));
export const CarreraSelect = memo(({marca,value,onChange,C}) => (
  <select value={value} onChange={e=>onChange(e.target.value)} style={{...iS(C),cursor:"pointer"}}>
    <option value="">— Selecciona carrera —</option>
    {Object.entries(CARRERAS[marca]).map(([g,cs])=>(
      <optgroup key={g} label={g}>{cs.map(c=><option key={c} value={c}>{c}</option>)}</optgroup>
    ))}
  </select>
));
export const ComunalidadSelect = memo(({value,onChange,C}) => {
  const sel=COMUNALIDADES.find(c=>c.valor===value);
  return (
    <div>
      <select value={value} onChange={e=>onChange(e.target.value)} style={{...iS(C),cursor:"pointer"}}>
        <option value="">— Selecciona Comunalidad Humana —</option>
        {COMUNALIDADES.map(c=><option key={c.valor} value={c.valor}>{c.valor}</option>)}
      </select>
      {sel&&<div style={{marginTop:5,padding:"6px 10px",background:C.accentLight,borderRadius:6,fontSize:11.5,color:C.primary,lineHeight:1.5}}>
        <strong>→ Retrato:</strong> {sel.retrato}<br/><span style={{color:C.muted}}>{sel.desc}</span>
      </div>}
    </div>
  );
});
export const InfoBox = memo(({C,children}) => <div style={{background:C.accentLight,borderRadius:8,padding:"9px 13px",fontSize:12,color:C.primary,marginTop:9,lineHeight:1.6,border:`1px solid ${C.border}`}}>{children}</div>);
