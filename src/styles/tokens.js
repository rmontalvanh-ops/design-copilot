// ── TOKENS DE DISEÑO ───────────────────────────────────────────────────────────
// Fase 1 de la mejora UI/UX: una sola escala para tipografía, espaciado, radios
// y transiciones. No sustituye el sistema de paleta dual (PAL en ecosistema.js)
// — los colores institucionales siguen viviendo ahí. Esto resuelve lo otro:
// que cada componente inventara su propio número mágico de padding o tamaño.

export const T = {
  font: {
    tiny: 12,    // metadatos, timestamps, contadores
    small: 13,   // texto secundario, tips, ayudas
    label: 13,   // etiquetas de campo
    body: 14,    // texto de inputs, botones, contenido general — antes 11-12px
    heading: 15, // títulos de sección dentro de un panel
    title: 17,   // títulos de pestaña
  },
  space: {
    xs: 4,
    sm: 8,
    md: 12,
    lg: 16,
    xl: 24,
  },
  radius: {
    sm: 6,
    md: 8,
    lg: 10,
    xl: 12,
    pill: 20,
  },
  transition: "150ms ease",
  // Punto de quiebre único para el layout de panel en espejo (50/50 → 1 columna).
  breakpoint: 900,
};

/** Estilo base de un input/select, reutilizable desde atomos.jsx. */
export const estiloCampo = (C) => ({
  width: "100%",
  padding: `${T.space.sm + 1}px ${T.space.md}px`,
  borderRadius: T.radius.md,
  border: `1.5px solid ${C.border}`,
  fontFamily: "Poppins,sans-serif",
  fontSize: T.font.body,
  color: "#1A2340",
  background: C.white,
  boxSizing: "border-box",
  outline: "none",
  transition: `border-color ${T.transition}, box-shadow ${T.transition}`,
});

/** Estilo base de un botón primario (sólido) o secundario (contorno). */
export const estiloBoton = (C, variante = "primario") => ({
  padding: `${T.space.sm + 1}px ${T.space.lg}px`,
  borderRadius: T.radius.md,
  border: variante === "primario" ? "none" : `1.5px solid ${C.primary}`,
  background: variante === "primario" ? C.primary : C.white,
  color: variante === "primario" ? "#fff" : C.primary,
  fontWeight: 600,
  fontSize: T.font.body,
  cursor: "pointer",
  fontFamily: "Poppins,sans-serif",
  transition: `transform ${T.transition}, opacity ${T.transition}`,
});
