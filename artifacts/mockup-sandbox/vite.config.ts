import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import tailwindcss from "@tailwindcss/vite";
import path from "path";
import type { Plugin } from "vite";
import { mockupPreviewPlugin } from "./mockupPreviewPlugin";

const port = Number(process.env.PORT ?? 5173);
const basePath = process.env.BASE_PATH ?? "/";
const isReplit = process.env.REPL_ID !== undefined;

export default defineConfig(async () => {
  const replitPlugins: Plugin[] = [];

  if (isReplit) {
    const { default: runtimeErrorOverlay } = await import(
      "@replit/vite-plugin-runtime-error-modal"
    );
    replitPlugins.push(runtimeErrorOverlay());

    if (process.env.NODE_ENV !== "production") {
      const { cartographer } = await import("@replit/vite-plugin-cartographer");
      replitPlugins.push(
        cartographer({
          root: path.resolve(import.meta.dirname, ".."),
        }),
      );
    }
  }

  return {
    base: basePath,

    plugins: [
      mockupPreviewPlugin(),
      react(),
      tailwindcss(),
      ...replitPlugins,
    ],

    resolve: {
      alias: {
        "@": path.resolve(import.meta.dirname, "src"),
      },
    },

    root: path.resolve(import.meta.dirname),

    build: {
      outDir: path.resolve(import.meta.dirname, "dist"),
      emptyOutDir: true,
    },

    server: {
      port,
      host: "0.0.0.0",
      allowedHosts: true,
      fs: {
        strict: true,
      },
    },

    preview: {
      port,
      host: "0.0.0.0",
      allowedHosts: true,
    },
  };
});
