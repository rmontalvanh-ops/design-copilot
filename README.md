# Design Co-Pilot · System Prompt Maestro

**v3.4** · UNITEC / CEUTEC Honduras · Ecosistema de Aprendizaje

> No ahorra tiempo. Libera tiempo para la transformación humana.

---

## Arrancar

```bash
npm install
npm run dev          # http://localhost:5173 · IA en modo simulado
```

Para probar la IA real hace falta la función serverless, que `vite` solo no levanta:

```bash
npm i -g netlify-cli
netlify dev          # http://localhost:8888 · sirve el sitio + /api/ia
```

Compilar para producción:

```bash
npm run build        # genera dist/
```

---

## Estructura

```
design-copilot/
├── index.html                    ← shell HTML, carga Poppins
├── vite.config.js
├── netlify.toml                  ← build, funciones, redirect SPA
├── .env.example                  ← plantilla de variables (copiar a .env)
├── netlify/functions/
│   └── ia.js                     ← proxy con la llave · Claude + Azure
└── src/
    ├── main.jsx                  ← punto de montaje
    ├── App.jsx                   ← header, navegación, 7 pestañas
    ├── data/ecosistema.js        ← paletas, 6 Comunalidades, carreras, PIE
    ├── services/ia.js            ← consultarIA() · cliente
    ├── utils/
    │   ├── memoria.js            ← mem{}, mGet, mSet, guardarHist
    │   └── formato.js            ← convertir(), descargarMd(), copiarTexto()
    ├── components/
    │   ├── atomos.jsx            ← Lbl, Inp, Sel, CarreraSelect, InfoBox
    │   ├── Terminal.jsx          ← Terminal, Presentación (Sprint F), FmtBtns
    │   ├── salida.jsx            ← AccionButtons, Validador, Puente, OutputPanel
    │   ├── paneles.jsx           ← Historial, ChatConsultor
    │   └── Comparador.jsx        ← Sprint D · 3Cs vs L2L
    └── tabs/                     ← una pestaña por archivo
```

---

## Conectar la IA

La app trae tres modos, controlados por `VITE_IA_MODO` en el archivo `.env`.

| Modo | Qué hace | Cuándo usarlo |
|---|---|---|
| `mock` | Respuesta simulada tras 1.3 s | Desarrollo de interfaz. No consume tokens. |
| `claude` | Anthropic API vía proxy | Piloto, demos, prototipado |
| `azure` | Azure OpenAI vía proxy | Producción institucional en el tenant de Microsoft |

### Por qué hay un proxy y no una llamada directa

Todo lo que ponés en el código del frontend viaja al navegador del usuario. Una llave de API en `src/` la lee cualquiera con `Ctrl+U` o abriendo la pestaña Network — y con esa llave se factura a la cuenta institucional. Por eso las llamadas pasan por `netlify/functions/ia.js`, que corre en el servidor.

Notá el detalle en `.env.example`: `VITE_IA_MODO` lleva prefijo `VITE_` y sí llega al navegador, pero `ANTHROPIC_API_KEY` **no lo lleva**. Vite solo expone al bundle las variables con ese prefijo. Es una salvaguarda del propio framework: aunque te equivoques, la llave no se filtra.

### Configurar en Netlify

Site settings → Environment variables:

| Variable | Valor |
|---|---|
| `ANTHROPIC_API_KEY` | `sk-ant-...` |
| `CLAUDE_MODELO` | `claude-sonnet-4-6` (opcional) |
| `AZURE_OPENAI_ENDPOINT` | `https://<recurso>.openai.azure.com` |
| `AZURE_OPENAI_KEY` | llave del recurso |
| `AZURE_OPENAI_DEPLOYMENT` | nombre del deployment |

Después redesplegá: las variables se leen en tiempo de build/ejecución de la función.

### El system prompt vive en el servidor

`netlify/functions/ia.js` inyecta la identidad del Ecosistema en cada consulta: las 3Cs, el DIP de L2L, las 6 Comunalidades con su Retrato vinculado, los niveles Emergente → En Expansión, y la instrucción de responder como el Ecosistema y no como una IA genérica. Está del lado del servidor a propósito — si estuviera en el frontend, cualquiera podría editarlo desde la consola del navegador y hacer que la app institucional responda cualquier cosa.

Cambia según la marca activa: el consultor se presenta como UNITEC o como CEUTEC.

---

## Sobre "conectar MS Copilot"

Vale aclarar algo que suele confundirse, porque afecta la decisión de arquitectura.

**Microsoft 365 Copilot no expone una API pública de chat** para que una aplicación externa le mande mensajes y reciba respuestas. Es un producto de usuario final, no un endpoint. No existe un equivalente a `POST /copilot/chat`.

Las tres rutas reales dentro del mundo Microsoft:

**1. Azure OpenAI Service** — es lo que implementa el modo `azure`. Corre en el tenant institucional, los datos no salen de la suscripción de Azure, y es la ruta que más se parece a lo que la gente quiere decir cuando dice "conectarlo a Copilot". Ya está listo en el código.

**2. Copilot Studio + Direct Line** — construís el agente PlanIA como agente de Copilot Studio y lo consumís desde la app por la API Direct Line del canal. Es más trabajo, pero es exactamente la pregunta que hizo el jurado de PROYÉCTATE sobre integración con Copilot Studio. Ventaja concreta: el mismo agente queda disponible en Teams para los docentes, sin pasar por la app.

**3. El flujo actual de copiar y pegar** — el docente genera el System Prompt en la app y lo pega en su Copilot. Cero infraestructura, cero costo, cero riesgo de datos. Es lo que ya validaron 40+ docentes en el piloto.

No descartes la tercera. La integración automática es más elegante, pero la manual ya demostró 85% de adopción sostenida, y cada llamada a la API tiene costo por token que alguien tiene que presupuestar.

---

## Antes de activar la IA real — Política PG-IA-002

Encender `VITE_IA_MODO=claude` o `=azure` significa que la información que los docentes escriban en los chats sale hacia un proveedor externo. Eso deja de ser una decisión técnica.

- **Aprobación previa.** La Política Interna de Uso de IA (PG-IA-002) establece que no se usan herramientas de IA distintas a las aprobadas sin consulta previa al Consejo de IA, y que no se implementan nuevas herramientas sin esa consulta. Escribí a **consejoIA@unitec.edu** antes de conectar un proveedor.
- **Nivel de información.** Los insumos de planificación docente son información interna, no pública. Los niveles 2, 3 y 4 admiten únicamente herramientas aprobadas institucionales. Si Azure OpenAI ya está dentro del tenant institucional, esa ruta suele ser la más alineada; para Anthropic hace falta valoración del Consejo.
- **Datos mínimos.** El cliente ya recorta el historial a los últimos 12 mensajes y el system prompt le prohíbe al modelo pedir datos de estudiantes. Reforzalo en la capacitación: nada de nombres completos, números de cuenta ni expedientes en el chat.
- **Human in the Loop.** Toda salida es borrador hasta que el docente la revisa y aprueba. La app ya lo declara en el pie de cada output y en el modo presentación.
- **Transparencia.** El uso de IA debe declararse en los entregables. El bloque `PIE` lo hace automáticamente; no lo quites.
- **"Si ves algo, dilo".** El manejo de errores de `services/ia.js` le recuerda al docente reportar comportamientos inesperados al Consejo de IA.

---

## Publicar

**Con Git (recomendado):** subí el repo a GitHub → en Netlify, "Add new site" → "Import an existing project". Netlify lee `netlify.toml`, corre `npm run build`, publica `dist/` y despliega la función. Cada push redespliega solo.

**Sin Git:** `npm run build` y arrastrá la carpeta `dist/` a `app.netlify.com/drop`. Ojo: así **no se despliega la función**, y la IA real no va a funcionar. Solo sirve para el modo `mock`.

---

## Pendientes

- **Sprint E** — indicador de completitud de formularios.
- **Sprint G** — plantillas guardadas. Obliga a decidir la persistencia: hoy `mem{}` se borra al recargar, lo cual es deliberado mientras no haya postura institucional sobre guardar datos del docente en el navegador.

---

*Rafael Montalván · Coordinador Académico, CEUTEC Honduras · 2025-2026*
