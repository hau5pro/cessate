import "./vite-node-polyfill";

import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
// https://vite.dev/config/
export default defineConfig({
  plugins: [react()],
  base: "/cessate/",
  build: {
    outDir: "dist",
  },
});
