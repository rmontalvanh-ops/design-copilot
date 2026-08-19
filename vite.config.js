import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";

export default defineConfig({
  plugins: [react()],
  build: { outDir: "dist", sourcemap: false },
  server: {
    port: 5173,
    // En `npm run dev` no hay funciones serverless. Para probar la IA real
    // usá `npm run dev:api` (netlify dev), que sirve /api/ia en el puerto 8888.
  },
});
