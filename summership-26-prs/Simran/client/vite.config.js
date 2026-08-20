import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";

export default defineConfig({
  plugins: [react()],
  server: {
    port: 5173,
    proxy: {
      "/api": "http://localhost:5000",
    },
  },
  // Baked in once, when this config is evaluated at dev-server boot — NOT
  // on every HMR update or browser refresh. Used by devBootReset.js to
  // tell "the dev server was restarted" apart from "the page was
  // refreshed", so learner progress only resets on the former.
  define: {
    __PYBE_BOOT_ID__: JSON.stringify(Date.now()),
  },
});
