// @lovable.dev/vite-tanstack-config already includes the following — do NOT add them manually
// or the app will break with duplicate plugins:
//   - TanStack devtools (dev-only, first), tanstackStart, viteReact, tailwindcss, tsConfigPaths,
//     nitro (build-only using cloudflare as a default target), VITE_* env injection, @ path alias,
//     React/TanStack dedupe, error logger plugins, and sandbox detection (port/host/strictPort).
// You can pass additional config via defineConfig({ vite: { ... }, etc... }) if needed.
import { defineConfig } from "@lovable.dev/vite-tanstack-config";
import { VitePWA } from "vite-plugin-pwa";

export default defineConfig({
  tanstackStart: {
    // Redirect TanStack Start's bundled server entry to src/server.ts (our SSR error wrapper).
    // nitro/vite builds from this
    server: { entry: "server" },
  },
  vite: {
    plugins: [
      VitePWA({
        registerType: "autoUpdate",
        injectRegister: null,
        devOptions: { enabled: false },
        manifest: false,
        filename: "sw.js",
        outDir: "dist/client",
        strategies: "generateSW",
        workbox: {
          globDirectory: "dist/client",
          globPatterns: ["**/*.{js,css,png,svg,woff2}"],
          navigateFallback: null,
          cleanupOutdatedCaches: true,
          clientsClaim: true,
          skipWaiting: true,
          runtimeCaching: [
            {
              // Pages: always try the network first, fall back to the last saved copy.
              urlPattern: ({ request, url }) =>
                request.mode === "navigate" && !url.pathname.startsWith("/~oauth") && !["/auth", "/profil", "/admin"].some(path => url.pathname.startsWith(path)),
              handler: "NetworkFirst",
              options: {
                cacheName: "public-pages-v2",
                networkTimeoutSeconds: 4,
                expiration: { maxEntries: 60 },
              },
            },
            {
              // Hashed build assets (same origin only).
              urlPattern: ({ url, sameOrigin }) => sameOrigin && url.pathname.startsWith("/assets/"),
              handler: "CacheFirst",
              options: { cacheName: "assets", expiration: { maxEntries: 300 } },
            },
            {
              // Public course material only: never cache personal records across sessions.
              urlPattern: ({ url, request }) =>
                request.method === "GET" && ["/rest/v1/lessons", "/rest/v1/lesson_questions"].includes(url.pathname),
              handler: "NetworkFirst",
              options: {
                cacheName: "public-lesson-data-v2",
                networkTimeoutSeconds: 5,
                expiration: { maxEntries: 400 },
              },
            },
            {
              // Bible verses already looked up.
              urlPattern: ({ url }) => url.hostname === "bolls.life",
              handler: "NetworkFirst",
              options: {
                cacheName: "bible-verses",
                networkTimeoutSeconds: 5,
                expiration: { maxEntries: 500 },
              },
            },
          ],
        },
      }),
    ],
  },
});
