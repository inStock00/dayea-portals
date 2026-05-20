// Pure-Vite SPA build for static hosting (S3/CloudFront, Netlify, etc.).
// Bypasses the Lovable TanStack-Start preset entirely — no SSR, no Cloudflare
// Worker output, no server functions. Outputs a static `dist/` folder.
//
// Build:    bun run build:static
// Preview:  bunx vite preview --config vite.config.static.ts
//
// IMPORTANT: This is a separate pipeline. The default `bun run build` still
// uses vite.config.ts (Lovable preview / Cloudflare Worker target).
import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import tsconfigPaths from "vite-tsconfig-paths";
import tailwindcss from "@tailwindcss/vite";
import { tanstackRouter } from "@tanstack/router-plugin/vite";
import path from "node:path";

export default defineConfig({
  plugins: [
    tanstackRouter({
      target: "react",
      autoCodeSplitting: true,
      routesDirectory: "src/routes",
      generatedRouteTree: "src/routeTree.gen.ts",
    }),
    react(),
    tsconfigPaths(),
    tailwindcss(),
  ],
  resolve: {
    alias: {
      "@": path.resolve(__dirname, "./src"),
    },
  },
  build: {
    outDir: "dist",
    emptyOutDir: true,
    sourcemap: false,
  },
  // SPA — no SSR. index.html is the single entry; router handles all paths
  // client-side. Configure your host (S3+CloudFront, etc.) to serve
  // index.html for unknown paths (404 -> /index.html) so deep links work.
});
