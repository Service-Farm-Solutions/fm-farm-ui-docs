import { defineConfig } from 'vite'
import mdx from "@mdx-js/rollup";
import tailwindcss from '@tailwindcss/vite'
// import react from '@vitejs/plugin-react-swc'

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [
    {enforce: 'pre', ...mdx()},
    tailwindcss(),
    // react({include: /\.(jsx|js|mdx|md|tsx|ts)$/})
  ],
  base: "/fm-farm-ui-docs/"
})
