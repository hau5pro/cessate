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
        display: "standalone",
        background_color: "#3c2d96",
        theme_color: "#000000",
        icons: [192, 256, 384, 512].map((x) => ({
          src: `/cessate/icon.svg`,
          sizes: `${x}x${x}`,
          type: "image/svg+xml",
          purpose: "any",
        })),
      },
    }),
  ],
  base: "/cessate/",
  build: {
    outDir: "dist",
  },
});
