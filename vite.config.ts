import { VitePWA } from "vite-plugin-pwa";
import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";

// https://vite.dev/config/
export default defineConfig({
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
        // display: "standalone",
        background_color: "#3c2d96",
        theme_color: "#ffffff",
        icons: [
          {
            src: "/cessate.svg",
            sizes: "192x192",
            type: "image/svg+xml",
          },
          {
            src: "/cessate.svg",
            sizes: "512x512",
            type: "image/svg+xml",
          },
        ],
      },
    }),
  ],
  base: "/cessate/",
  build: {
    outDir: "dist",
  },
});
