import { useMemo } from "react";
import { T } from "../styles/tokens";

// ── SPRINT E · COMPLETITUD DE FORMULARIOS ─────────────────────────────────────
// Barra de progreso genérica para cualquier formulario de la app. Un campo
// cuenta como "lleno" si tiene un valor truthy (string no vacío, array con al
// menos un elemento). Devuelve también qué falta, para el mensaje contextual.
//
// Uso: <Completitud campos={[{label:"Carrera",valor:carrera}, ...]} C={C}/>
// El padre puede leer el % con useCompletitud(campos) si necesita pasarlo a
// AccionButtons (para la animación del botón Copiar al llegar a 100%).

function estaLleno(valor) {
  if (Array.isArray(valor)) return valor.length > 0;
  return !!valor && String(valor).trim() !== "";
}

export function useCompletitud(campos) {
  return useMemo(() => {
    const total = campos.length;
    const llenos = campos.filter(c => estaLleno(c.valor));
    const pct = total ? Math.round((llenos.length / total) * 100) : 0;
    const faltan = campos.filter(c => !estaLleno(c.valor)).map(c => c.label);
    return { pct, faltan, completo: pct === 100 };
  }, [campos]);
}

export function Completitud({campos, C}) {
  const { pct, faltan, completo } = useCompletitud(campos);
  const color = completo ? C.success : pct >= 50 ? C.accent : C.warn;

  return (
    <div style={{marginTop:T.space.sm, marginBottom:T.space.xs}}>
      <div style={{display:"flex",alignItems:"center",gap:T.space.sm}}>
        <div style={{flex:1,height:6,borderRadius:4,background:C.border,overflow:"hidden"}}>
          <div style={{width:`${pct}%`,height:"100%",background:color,borderRadius:4,transition:`width ${T.transition}`}}/>
        </div>
        <span style={{fontSize:T.font.tiny,fontWeight:700,color,minWidth:34,textAlign:"right"}}>{pct}%</span>
      </div>
      {!completo && faltan.length > 0 && (
        <div style={{fontSize:T.font.tiny,color:C.muted,marginTop:3}}>
          Falta: {faltan.join(", ")}
        </div>
      )}
      {completo && (
        <div style={{fontSize:T.font.tiny,color:C.success,marginTop:3,fontWeight:600}}>
          ✓ Formulario completo — listo para generar
        </div>
      )}
    </div>
  );
}
