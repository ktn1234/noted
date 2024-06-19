import { ConfigEnv, defineConfig } from "vite";
import react from "@vitejs/plugin-react-swc";
import { VitePWA } from "vite-plugin-pwa";
import path from "path";

// https://vitejs.dev/config/
export default defineConfig(({ mode }: ConfigEnv) => {
  const isProduction = mode === "production";
  return {
    server: {
      port: 5173,
      host: true,
    },
    plugins: [
      react(),
      VitePWA({
        registerType: "autoUpdate",
        manifestFilename: "manifest.json",
        includeAssets: ["**/*.{js,css,html,ico,png,svg,jpg}"], // For precaching files under publidDir only
        manifest: {
          id: "noted",
          short_name: "Noted",
          name: "Noted",
          description: "Note things down",
          icons: [
            {
              src: "assets/manifest-icon-192.maskable.png",
              sizes: "192x192",
              type: "image/png",
              purpose: "any",
            },
            {
              src: "assets/manifest-icon-192.maskable.png",
              sizes: "192x192",
              type: "image/png",
              purpose: "maskable",
            },
            {
              src: "assets/manifest-icon-512.maskable.png",
              sizes: "512x512",
              type: "image/png",
              purpose: "any",
            },
            {
              src: "assets/manifest-icon-512.maskable.png",
              sizes: "512x512",
              type: "image/png",
              purpose: "maskable",
            },
          ],
          start_url: "/",
          scope: "/",
          lang: "en",
          display: "standalone",
          theme_color: "#64CCC5",
          background_color: "#04364A",
        },
      }),
    ],
    publicDir: "public",
    build: {
      sourcemap: !isProduction,
      outDir: "dist",
    },
    resolve: {
      alias: {
        "@": path.resolve(__dirname, "./src"),
        "@components": path.resolve(__dirname, "./src/components"),
      },
    },
  };
});
