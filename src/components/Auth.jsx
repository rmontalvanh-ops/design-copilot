import { useState, useEffect, useCallback } from "react";
// VERIFICADO contra la documentación pública del paquete (npm): login(email,
// password), getUser() sin argumentos, y logout() son las firmas correctas
// tanto en navegador como en Netlify Functions — mismo paquete, mismas
// funciones en ambos contextos. No se pudo instalar el paquete en este
// entorno de trabajo (sin acceso al registro de npm) para correrlo de
// verdad — ver la advertencia sobre pruebas locales de Identity en la
// sección de riesgos entregada junto con esta implementación.
import { login, logout, getUser } from "@netlify/identity";
import { Lbl, Inp } from "./atomos";
import { PAL, NOMBRES } from "../data/ecosistema";

// ── PANTALLA DE LOGIN ──────────────────────────────────────────────────────────
// Paleta neutra antes de que exista una "marca" elegida: se usa UNITEC porque
// es el valor por defecto que ya trae App.jsx (useState("UNITEC")) — no es una
// asociación real de la cuenta con esa institución, es solo el fondo visual de
// esta pantalla previa al login. No se persiste ni se envía a ningún lado.
const C_LOGIN = PAL.UNITEC;

function PantallaLogin({ onIngreso }) {
  const [email, setEmail] = useState("");
  const [clave, setClave] = useState("");
  const [cargando, setCargando] = useState(false);
  const [error, setError] = useState("");

  const enviar = useCallback(async (e) => {
    e.preventDefault();
    if (!email.trim() || !clave.trim()) return;
    setCargando(true); setError("");
    try {
      await login(email.trim(), clave);
      onIngreso();
    } catch (err) {
      // Mensaje genérico y seguro — no se expone el detalle crudo del
      // proveedor de identidad al usuario (mismo principio que /api/ia).
      setError("Correo o contraseña incorrectos, o la cuenta todavía no fue habilitada para el piloto.");
      console.error("[Auth] fallo de login:", err);
    } finally {
      setCargando(false);
    }
  }, [email, clave, onIngreso]);

  return (
    <div style={{ minHeight: "100vh", display: "flex", alignItems: "center", justifyContent: "center", background: C_LOGIN.bg, fontFamily: "Poppins,sans-serif", padding: 20 }}>
      <form onSubmit={enviar} style={{ width: "100%", maxWidth: 380, background: C_LOGIN.white, borderRadius: 14, padding: "32px 28px", boxShadow: "0 10px 40px rgba(6,6,92,0.12)", border: `1px solid ${C_LOGIN.border}` }}>
        <div style={{ textAlign: "center", marginBottom: 22 }}>
          <div style={{ fontSize: 22, fontWeight: 800, color: C_LOGIN.primary }}>Design Co-Pilot</div>
          <div style={{ fontSize: 12, color: C_LOGIN.muted, marginTop: 4 }}>Acceso piloto institucional · UNITEC / CEUTEC</div>
        </div>

        <Lbl C={C_LOGIN}>Correo institucional</Lbl>
        <Inp value={email} onChange={setEmail} placeholder="docente@unitec.edu" C={C_LOGIN} type="email" />

        <Lbl C={C_LOGIN}>Contraseña</Lbl>
        <Inp value={clave} onChange={setClave} placeholder="••••••••" C={C_LOGIN} type="password" />

        {error && (
          <div style={{ marginTop: 10, padding: "9px 12px", borderRadius: 8, background: `${C_LOGIN.danger}15`, border: `1px solid ${C_LOGIN.danger}`, color: C_LOGIN.danger, fontSize: 12.5 }}>
            {error}
          </div>
        )}

        <button type="submit" disabled={cargando} className="dcp-btn" style={{ width: "100%", marginTop: 18, padding: "11px 0", borderRadius: 8, border: "none", background: C_LOGIN.primary, color: "#fff", fontWeight: 700, fontSize: 14, cursor: cargando ? "default" : "pointer", opacity: cargando ? 0.7 : 1 }}>
          {cargando ? "Ingresando..." : "Ingresar"}
        </button>

        <div style={{ marginTop: 16, fontSize: 11, color: C_LOGIN.muted, textAlign: "center", lineHeight: 1.6 }}>
          Piloto controlado — acceso solo con cuenta institucional invitada.
          <br />Si no tenés cuenta, contactá a la coordinación académica.
        </div>
      </form>
    </div>
  );
}

// ── GATE DE AUTENTICACIÓN ──────────────────────────────────────────────────────
// Envuelve a <App/> completa. Vive en main.jsx, no dentro de App.jsx — la
// lógica interna de la aplicación no se toca en absoluto.
export function AuthGate({ children }) {
  const [usuario, setUsuario] = useState(undefined); // undefined = todavía verificando
  const [cerrandoSesion, setCerrandoSesion] = useState(false);

  useEffect(() => {
    let vivo = true;
    getUser()
      .then(u => { if (vivo) setUsuario(u || null); })
      .catch(() => { if (vivo) setUsuario(null); });
    return () => { vivo = false; };
  }, []);

  const handleLogout = useCallback(async () => {
    setCerrandoSesion(true);
    try { await logout(); } catch (e) { console.error("[Auth] fallo de logout:", e); }
    setUsuario(null);
    setCerrandoSesion(false);
  }, []);

  // Todavía verificando la sesión — evita un parpadeo de pantalla de login
  // antes de saber si en realidad ya hay una sesión activa.
  if (usuario === undefined) {
    return (
      <div style={{ minHeight: "100vh", display: "flex", alignItems: "center", justifyContent: "center", background: C_LOGIN.bg, color: C_LOGIN.muted, fontFamily: "Poppins,sans-serif", fontSize: 13 }}>
        Verificando sesión...
      </div>
    );
  }

  if (!usuario) {
    return <PantallaLogin onIngreso={() => getUser().then(u => setUsuario(u || null))} />;
  }

  // Sesión activa: se renderiza la app existente TAL CUAL, sin ningún cambio.
  // El botón de cerrar sesión se agrega como hermano flotante, nunca dentro
  // de <App/> — así App.jsx no necesita saber que existe autenticación.
  return (
    <>
      {children}
      <button
        onClick={handleLogout}
        disabled={cerrandoSesion}
        className="dcp-btn"
        title="Cerrar sesión"
        style={{
          position: "fixed", bottom: 14, right: 14, zIndex: 9998,
          padding: "8px 14px", borderRadius: 20, border: "none",
          background: "rgba(20,20,30,0.82)", color: "#fff",
          fontSize: 11.5, fontWeight: 600, fontFamily: "Poppins,sans-serif",
          cursor: cerrandoSesion ? "default" : "pointer", opacity: cerrandoSesion ? 0.6 : 1,
          boxShadow: "0 2px 10px rgba(0,0,0,0.25)",
        }}
      >
        {cerrandoSesion ? "Saliendo..." : "⎋ Cerrar sesión"}
      </button>
    </>
  );
}
