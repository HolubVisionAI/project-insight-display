import { defineConfig, loadEnv } from "vite";
import react from "@vitejs/plugin-react-swc";
import path from "path";
import { componentTagger } from "lovable-tagger";

export default defineConfig(({ command, mode }) => {
  // Load environment variables prefixed with VITE_
  const env = loadEnv(mode, process.cwd(), "");
  const isDev = command === "serve";

  // URL of your backend API (override in .env.production / .env.development)
  const API_URL = env.VITE_API_URL || "http://localhost:8000";

  // Base public path for production (e.g. if you deploy under /app/)
  const BASE_PATH = env.VITE_BASE_PATH || "/";

  return {
    // Use / in dev; in prod pick up BASE_PATH from env
    base: isDev ? "/" : BASE_PATH,

    server: {
      // Listen on all network interfaces (useful for Docker/VM)
      host: true,

      // Force the HMR client to connect back to localhost
      hmr: {
        host: "localhost",
        protocol: "ws",
        // clientPort: 8080, // uncomment if you need to override port
      },

      // Proxy API requests to your FastAPI backend
      proxy: {
        "/api": {
          target: API_URL,
          changeOrigin: true,
          secure: false,
          // If your backend is mounted at root (no /api prefix), uncomment:
          // rewrite: (path) => path.replace(/^\/api/, ""),
        },
      },
    },

    plugins: [
      react(),
      // Tag React components with displayName in development for easier debugging
      isDev && componentTagger(),
    ].filter(Boolean),

    resolve: {
      alias: {
        "@": path.resolve(__dirname, "./src"),
      },
    },
  };
});
