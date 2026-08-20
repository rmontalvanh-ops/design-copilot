import { memo } from "react";
import { CARRERAS, COMUNALIDADES } from "../data/ecosistema";
import { T, estiloCampo } from "../styles/tokens";

// ── ÁTOMOS ────────────────────────────────────────────────────────────────────
// Migrados a tokens (Fase 1 UI/UX): tipografía legible (14px, antes 11-13px),
// espaciado y radios consistentes. className="dcp-field" trae el estado de
// foco (ver hoja global inyectada en App.jsx) sin necesidad de repetirlo aquí.
export const iS = estiloCampo; // alias retrocompatible — el resto del código aún lo importa
export const Lbl = memo(({C,children}) => <label style={{display:"block",fontWeight:600,color:C.primary,fontSize:T.font.label,marginBottom:T.space.xs,marginTop:T.space.md}}>{children}</label>);
export const Inp = memo(({placeholder,value,onChange,C,type="text",rows}) => {
  const s=estiloCampo(C);
  return rows
    ? <textarea className="dcp-field" value={value} onChange={e=>onChange(e.target.value)} placeholder={placeholder} rows={rows} style={{...s,resize:"vertical",lineHeight:1.6}}/>
    : <input className="dcp-field" type={type} value={value} onChange={e=>onChange(e.target.value)} placeholder={placeholder} style={s}/>;
});
export const Sel = memo(({options,value,onChange,C}) => (
  <select className="dcp-field" value={value} onChange={e=>onChange(e.target.value)} style={{...estiloCampo(C),cursor:"pointer"}}>
    <option value="">— Selecciona —</option>
    {options.map(o=><option key={o} value={o}>{o}</option>)}
  </select>
));
export const CarreraSelect = memo(({marca,value,onChange,C}) => (
  <select className="dcp-field" value={value} onChange={e=>onChange(e.target.value)} style={{...estiloCampo(C),cursor:"pointer"}}>
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
      <select className="dcp-field" value={value} onChange={e=>onChange(e.target.value)} style={{...estiloCampo(C),cursor:"pointer"}}>
        <option value="">— Selecciona Comunalidad Humana —</option>
        {COMUNALIDADES.map(c=><option key={c.valor} value={c.valor}>{c.valor}</option>)}
      </select>
      {sel&&<div style={{marginTop:T.space.xs+2,padding:`${T.space.sm}px ${T.space.md}px`,background:C.accentLight,borderRadius:T.radius.sm,fontSize:T.font.small,color:C.primary,lineHeight:1.6,border:`1px solid ${C.border}`}}>
        <strong>→ Retrato del Egresado:</strong> {sel.retrato}<br/><span style={{color:C.muted}}>{sel.desc}</span>
      </div>}
    </div>
  );
});
export const InfoBox = memo(({C,children}) => <div style={{background:C.accentLight,borderRadius:T.radius.md,padding:`${T.space.sm+1}px ${T.space.md+3}px`,fontSize:T.font.small,color:C.primary,marginTop:T.space.sm+1,lineHeight:1.65,border:`1px solid ${C.border}`}}>{children}</div>);
