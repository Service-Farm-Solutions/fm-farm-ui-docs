import { defineConfig } from 'vite'
import mdx from "@mdx-js/rollup";
import tailwindcss from '@tailwindcss/vite'
import { readdirSync } from "node:fs";
import releases from "./src/routes.js";
import { validateReleases } from "./src/docs/releases.js";
import remarkHeadings from "./src/docs/remarkHeadings.js";

// https://vitejs.dev/config/
export default defineConfig({
  esbuild: { jsx: "automatic" },
  plugins: [
    {
      name: "validate-documentation-releases",
      buildStart() {
        const files = readdirSync(new URL("./src/Pages/releases/", import.meta.url), { recursive: true })
          .filter(file => file.endsWith(".mdx"))
          .map(file => `./Pages/releases/${file.replaceAll("\\", "/")}`);
        validateReleases(releases, files);
      },
    },
    {enforce: 'pre', ...mdx({ remarkPlugins: [remarkHeadings] })},
    tailwindcss(),
  ],
  base: "/fm-farm-ui-docs/"
})
