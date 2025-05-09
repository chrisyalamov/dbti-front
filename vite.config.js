import { defineConfig } from "vite";
import viteReact from "@vitejs/plugin-react";
import tailwindcss from "@tailwindcss/vite";
import tsconfigPaths from "vite-tsconfig-paths";

import { TanStackRouterVite } from "@tanstack/router-plugin/vite";

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [
    tsconfigPaths(),
    TanStackRouterVite({ autoCodeSplitting: true }), 
    viteReact(), 
    tailwindcss()
  ],
  test: {
    globals: true,
    environment: "jsdom",
  },
  base: "/dbti-front/",
  server: {
    allowedHosts: ["dev-3000.chrisyalamov.space"],
  },
});
