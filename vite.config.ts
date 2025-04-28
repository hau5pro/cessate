import { VitePWA } from "vite-plugin-pwa";
import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";

// https://vite.dev/config/
export default defineConfig({
  base: "/cessate/",
  build: {
    outDir: "dist",
  },
  plugins: [
    react(),
    VitePWA({
      registerType: "autoUpdate",
      includeAssets: ["favicon.ico", "robots.txt"],
      manifest: {
        name: "Cessate",
        short_name: "Cessate",
        description: "A habit cessation tool",
        start_url: "https://hau5pro.github.io/cessate/",
        display: "standalone",
        background_color: "#3c2d96",
        theme_color: "#000000",
        icons: [
          {
            src: "192.png",
            sizes: "192x192",
            type: "image/png",
            purpose: "any",
          },
          {
            src: "512.png",
            sizes: "512x512",
            type: "image/png",
            purpose: "any",
          },
        ],
      },
    }),
  ],
});
