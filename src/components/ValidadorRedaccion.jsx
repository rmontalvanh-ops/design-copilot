import { useMemo, useState } from "react";
import { CheckCircle, AlertCircle, ChevronDown, ChevronUp } from "lucide-react";
import { auditarPlanner } from "../data/reglasPlanner";

// ── SPRINT H · VALIDADOR DE REDACCIÓN DEL PLANNER ─────────────────────────────
// Corre las 12 reglas locales de ESTANDARES_PLANNER.md contra un texto de
// Planner ya redactado. Distinto del Validador del Sprint A: aquel evalúa el
// PROMPT que PlanIA genera; este evalúa el PLANNER que un docente escribió.
export function ValidadorRedaccion({ texto, C, compact = false }) {
  const [abierto, setAbierto] = useState(!compact);
  const r = useMemo(() => auditarPlanner(texto), [texto]);

  if (!texto || !texto.trim()) return null;

  const color = r.indice >= 90 ? C.success : r.indice >= 70 ? C.accent : r.indice >= 40 ? C.warn : C.danger;

  return (
    <div style={{ marginTop: 12, border: `1px solid ${C.border}`, borderRadius: 9, overflow: "hidden", background: C.white }}>
      <button onClick={() => setAbierto(a => !a)} style={{ width: "100%", display: "flex", justifyContent: "space-between", alignItems: "center", padding: "10px 14px", background: C.bg, border: "none", cursor: "pointer", fontFamily: "Poppins,sans-serif" }}>
        <span style={{ display: "flex", alignItems: "center", gap: 8, fontSize: 12.5, fontWeight: 700, color: C.primary }}>
          📐 Validador de Redacción del Planner
          <span style={{ fontSize: 10.5, fontWeight: 600, color: C.muted, background: C.accentLight, padding: "2px 7px", borderRadius: 10 }}>
            {r.evaluadas} de {r.total} reglas evaluadas
          </span>
        </span>
        {abierto ? <ChevronUp size={14} color={C.muted} /> : <ChevronDown size={14} color={C.muted} />}
      </button>

      {abierto && (
        <div style={{ padding: "14px" }}>
          {/* Índice y nivel — mismo lenguaje visual que el Validador de Coherencia */}
          <div style={{ display: "flex", alignItems: "center", gap: 12, marginBottom: 12 }}>
            <div style={{ flex: 1, height: 9, borderRadius: 5, background: C.border, overflow: "hidden" }}>
              <div style={{ width: `${r.indice}%`, height: "100%", background: color, transition: "width .5s ease", borderRadius: 5 }} />
            </div>
            <span style={{ fontSize: 13, fontWeight: 800, color, minWidth: 42, textAlign: "right" }}>{r.indice}%</span>
          </div>
          <div style={{ fontSize: 11.5, color: C.muted, marginBottom: 12 }}>
            Nivel: <strong style={{ color }}>{r.nivel}</strong> · {r.cumplidas} cumplidas de {r.evaluadas} evaluadas
            {r.noEvaluadas.length > 0 && <> · {r.noEvaluadas.length} sección(es) no encontrada(s), no afectan el índice</>}
          </div>

          {/* Reglas que fallan, con su tip */}
          {r.fallidas.length > 0 && (
            <div style={{ display: "flex", flexDirection: "column", gap: 8, marginBottom: r.noEvaluadas.length ? 12 : 0 }}>
              {r.fallidas.map(f => (
                <div key={f.id} style={{ display: "flex", gap: 8, alignItems: "flex-start", fontSize: 11.5, padding: "8px 10px", background: C.accentLight, borderRadius: 7, borderLeft: `3px solid ${C.warn || C.accent}` }}>
                  <AlertCircle size={14} color={C.warn || C.accent} />
                  <div>
                    <div style={{ fontWeight: 700, color: C.primary }}>{f.area} · {f.regla}</div>
                    <div style={{ color: C.muted, marginTop: 2 }}>{f.tip}</div>
                    {f.nota && <div style={{ color: C.muted, marginTop: 2, fontStyle: "italic" }}>{f.nota}</div>}
                    <div style={{ color: C.muted, marginTop: 3, fontSize: 10 }}>Frecuencia observada: {f.frecuencia} · Fuente: {f.origen}</div>
                  </div>
                </div>
              ))}
            </div>
          )}

          {r.fallidas.length === 0 && r.evaluadas > 0 && (
            <div style={{ display: "flex", gap: 8, alignItems: "center", fontSize: 12, color: C.success, fontWeight: 600 }}>
              <CheckCircle size={15} /> Todas las reglas evaluables se cumplen.
            </div>
          )}

          {/* Secciones que no se pudieron localizar en el texto */}
          {r.noEvaluadas.length > 0 && (
            <details style={{ marginTop: 10 }}>
              <summary style={{ fontSize: 10.5, color: C.muted, cursor: "pointer" }}>
                Ver {r.noEvaluadas.length} regla(s) no evaluada(s) — sección no encontrada en el texto
              </summary>
              <div style={{ marginTop: 6, display: "flex", flexDirection: "column", gap: 4 }}>
                {r.noEvaluadas.map(f => (
                  <div key={f.id} style={{ fontSize: 10.5, color: C.muted }}>· {f.area} · {f.regla}</div>
                ))}
              </div>
            </details>
          )}

          <div style={{ marginTop: 12, fontSize: 9.5, color: C.muted, borderTop: `1px solid ${C.border}`, paddingTop: 8 }}>
            12 reglas locales · sin IA · basadas en la Guía de Errores del Decano, la plantilla oficial 2026 y Train the Trainers.
            {r.resultados.some(x => x.id === "L7") && <> La Meta de Carácter acepta ambas fórmulas hasta decisión institucional (D1).</>}
          </div>
        </div>
      )}
    </div>
  );
}
