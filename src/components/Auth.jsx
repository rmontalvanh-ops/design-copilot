import { useState, useEffect, useCallback } from "react";
// VERIFICADO contra la documentación pública del paquete (npm y docs.netlify.com):
//   login(email, password) · getUser() sin argumentos · logout()
//   handleAuthCallback() · acceptInvite(token, password)
// Mismas funciones en navegador y en Netlify Functions. No se pudo instalar el
// paquete en este entorno de trabajo (sin acceso al registro de npm) para
// correrlo de verdad — ver la sección de riesgos entregada.
import { login, logout, getUser, handleAuthCallback, acceptInvite } from "@netlify/identity";
import { Lbl, Inp } from "./atomos";
import { PAL } from "../data/ecosistema";

// ── PANTALLA DE LOGIN ──────────────────────────────────────────────────────────
// Paleta neutra antes de que exista una "marca" elegida: se usa UNITEC porque
// es el valor por defecto que ya trae App.jsx (useState("UNITEC")) — no es una
// asociación real de la cuenta con esa institución, es solo el fondo visual de
// esta pantalla previa al login. No se persiste ni se envía a ningún lado.
const C_LOGIN = PAL.UNITEC;

function Tarjeta({ titulo, subtitulo, children }) {
  return (
    <div style={{ minHeight: "100vh", display: "flex", alignItems: "center", justifyContent: "center", background: C_LOGIN.bg, fontFamily: "Poppins,sans-serif", padding: 20 }}>
      <div style={{ width: "100%", maxWidth: 380, background: C_LOGIN.white, borderRadius: 14, padding: "32px 28px", boxShadow: "0 10px 40px rgba(6,6,92,0.12)", border: `1px solid ${C_LOGIN.border}` }}>
        <div style={{ textAlign: "center", marginBottom: 22 }}>
          <div style={{ fontSize: 22, fontWeight: 800, color: C_LOGIN.primary }}>{titulo}</div>
          {subtitulo && <div style={{ fontSize: 12, color: C_LOGIN.muted, marginTop: 4 }}>{subtitulo}</div>}
        </div>
        {children}
      </div>
    </div>
  );
}

function CampoError({ error }) {
  if (!error) return null;
  return (
    <div style={{ marginTop: 10, padding: "9px 12px", borderRadius: 8, background: `${C_LOGIN.danger}15`, border: `1px solid ${C_LOGIN.danger}`, color: C_LOGIN.danger, fontSize: 12.5 }}>
      {error}
    </div>
  );
}

function BotonEnviar({ cargando, textoNormal, textoCargando }) {
  return (
    <button type="submit" disabled={cargando} className="dcp-btn" style={{ width: "100%", marginTop: 18, padding: "11px 0", borderRadius: 8, border: "none", background: C_LOGIN.primary, color: "#fff", fontWeight: 700, fontSize: 14, cursor: cargando ? "default" : "pointer", opacity: cargando ? 0.7 : 1 }}>
      {cargando ? textoCargando : textoNormal}
    </button>
  );
}

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
      setError("Correo o contraseña incorrectos, o la cuenta todavía no fue habilitada para el piloto.");
      console.error("[Auth] fallo de login:", err);
    } finally {
      setCargando(false);
    }
  }, [email, clave, onIngreso]);

  return (
    <Tarjeta titulo="Design Co-Pilot" subtitulo="Acceso piloto institucional · UNITEC / CEUTEC">
      <form onSubmit={enviar}>
        <Lbl C={C_LOGIN}>Correo institucional</Lbl>
        <Inp value={email} onChange={setEmail} placeholder="docente@unitec.edu" C={C_LOGIN} type="email" />
        <Lbl C={C_LOGIN}>Contraseña</Lbl>
        <Inp value={clave} onChange={setClave} placeholder="••••••••" C={C_LOGIN} type="password" />
        <CampoError error={error} />
        <BotonEnviar cargando={cargando} textoNormal="Ingresar" textoCargando="Ingresando..." />
        <div style={{ marginTop: 16, fontSize: 11, color: C_LOGIN.muted, textAlign: "center", lineHeight: 1.6 }}>
          Piloto controlado — acceso solo con cuenta institucional invitada.
          <br />Si no tenés cuenta, contactá a la coordinación académica.
        </div>
      </form>
    </Tarjeta>
  );
}

// ── PANTALLA DE "CREAR CONTRASEÑA" (invitación / recuperación) ────────────────
// Se muestra SOLO cuando handleAuthCallback() detecta un invite_token (o un
// recovery_token en el que preferimos pedir la clave de nuevo por claridad) en
// la URL. Antes de este arreglo, la app no manejaba este token en absoluto:
// el docente volvía del correo de invitación y caía en el login normal, sin
// forma de crear una contraseña — la cuenta quedaba "aceptada" pero sin clave.
function PantallaCrearClave({ token, onListo }) {
  const [clave, setClave] = useState("");
  const [clave2, setClave2] = useState("");
  const [cargando, setCargando] = useState(false);
  const [error, setError] = useState("");

  const enviar = useCallback(async (e) => {
    e.preventDefault();
    if (clave.length < 8) { setError("La contraseña debe tener al menos 8 caracteres."); return; }
    if (clave !== clave2) { setError("Las contraseñas no coinciden."); return; }
    setCargando(true); setError("");
    try {
      const usuario = await acceptInvite(token, clave);
      onListo(usuario);
    } catch (err) {
      setError("No se pudo crear la contraseña. El enlace de invitación puede haber expirado — pedí que te reenvíen la invitación.");
      console.error("[Auth] fallo al aceptar invitación:", err);
    } finally {
      setCargando(false);
    }
  }, [token, clave, clave2, onListo]);

  return (
    <Tarjeta titulo="Bienvenido/a a Design Co-Pilot" subtitulo="Creá tu contraseña para completar el acceso al piloto">
      <form onSubmit={enviar}>
        <Lbl C={C_LOGIN}>Nueva contraseña</Lbl>
        <Inp value={clave} onChange={setClave} placeholder="Mínimo 8 caracteres" C={C_LOGIN} type="password" />
        <Lbl C={C_LOGIN}>Repetí la contraseña</Lbl>
        <Inp value={clave2} onChange={setClave2} placeholder="••••••••" C={C_LOGIN} type="password" />
        <CampoError error={error} />
        <BotonEnviar cargando={cargando} textoNormal="Crear contraseña e ingresar" textoCargando="Creando..." />
      </form>
    </Tarjeta>
  );
}

/** Limpia el token de la URL sin recargar, para no reprocesarlo si el docente refresca. */
function limpiarHash() {
  history.replaceState(null, "", window.location.pathname + window.location.search);
}

// ── GATE DE AUTENTICACIÓN ──────────────────────────────────────────────────────
// Envuelve a <App/> completa. Vive en main.jsx, no dentro de App.jsx — la
// lógica interna de la aplicación no se toca en absoluto.
export function AuthGate({ children }) {
  const [usuario, setUsuario] = useState(undefined); // undefined = todavía verificando
  const [invitacion, setInvitacion] = useState(null); // token pendiente de crear contraseña
  const [cerrandoSesion, setCerrandoSesion] = useState(false);

  useEffect(() => {
    let vivo = true;
    (async () => {
      const hash = window.location.hash || "";
      const tieneToken = /^#(confirmation_token|recovery_token|invite_token|email_change_token|access_token)=/.test(hash);

      if (tieneToken) {
        try {
          const resultado = await handleAuthCallback();
          limpiarHash();
          if (!vivo) return;
          if (resultado?.type === "invite" && resultado.token) {
            // Caso que estaba roto: no se loguea todavía, hace falta la clave.
            setInvitacion(resultado.token);
            setUsuario(null);
            return;
          }
          // Cualquier otro tipo (confirmación, recuperación, OAuth) queda
          // logueado automáticamente por handleAuthCallback().
          setUsuario(resultado?.user || (await getUser()) || null);
          return;
        } catch (e) {
          console.error("[Auth] fallo procesando el enlace de invitación/recuperación:", e);
          limpiarHash();
          // Sigue al chequeo normal de sesión en vez de quedar colgado.
        }
      }

      getUser()
        .then(u => { if (vivo) setUsuario(u || null); })
        .catch(() => { if (vivo) setUsuario(null); });
    })();
    return () => { vivo = false; };
  }, []);

  const handleLogout = useCallback(async () => {
    setCerrandoSesion(true);
    try { await logout(); } catch (e) { console.error("[Auth] fallo de logout:", e); }
    setUsuario(null);
    setCerrandoSesion(false);
  }, []);

  // Todavía verificando la sesión (o procesando un token) — evita un parpadeo
  // de pantalla de login antes de saber qué corresponde mostrar.
  if (usuario === undefined && !invitacion) {
    return (
      <div style={{ minHeight: "100vh", display: "flex", alignItems: "center", justifyContent: "center", background: C_LOGIN.bg, color: C_LOGIN.muted, fontFamily: "Poppins,sans-serif", fontSize: 13 }}>
        Verificando sesión...
      </div>
    );
  }

  if (invitacion) {
    return <PantallaCrearClave token={invitacion} onListo={(u) => { setInvitacion(null); setUsuario(u); }} />;
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
