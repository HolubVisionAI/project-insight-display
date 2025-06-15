import { defineConfig } from "vite";
import react from "@vitejs/plugin-react-swc";
import path from "path";
import { componentTagger } from "lovable-tagger";

export default defineConfig(({ mode }) => ({
  server: {
    // Listen on all interfaces (or explicitly "localhost")
    host: true, 

    // Force the HMR websocket client to connect to localhost:8080
    hmr: {
      host: "localhost",
      protocol: "ws",
      // If you need to force a port (e.g. inside Docker), you can add:
      // clientPort: 8080,
    },

    proxy: {
      "/api": {
        target: "http://localhost:8000",
        changeOrigin: true,
        secure: false,
      },
    },
  },

  plugins: [
    react(),
    mode === "development" && componentTagger(),
  ].filter(Boolean),

  resolve: {
    alias: {
      "@": path.resolve(__dirname, "./src"),
    },
  },
}));
