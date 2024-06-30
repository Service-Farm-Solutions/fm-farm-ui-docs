import { defineConfig } from 'vite'
import mdx from "@mdx-js/rollup";
import react from '@vitejs/plugin-react-swc'

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [mdx({}), react()],
  base: "https://service-farm-solutions.github.io/fm-farm-ui-docs/"
})
