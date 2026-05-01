import { defineConfig } from "vite";
import tailwindcss from "@tailwindcss/vite";
import path from "path";
import { fileURLToPath } from "url";
import courvuxSsg from "../plugin/vite-plugin-courvux-ssg.js";

const __dirname = path.dirname(fileURLToPath(import.meta.url));

export default defineConfig({
  base: "/courvux/",
  preview: {
    // Leading-dot patterns match any subdomain. Add other tunnel hosts
    // here as needed (e.g. ".trycloudflare.com", ".loca.lt").
    allowedHosts: [".ngrok-free.app", ".ngrok.io", ".ngrok.app"],
  },
  server: {
    allowedHosts: [".ngrok-free.app", ".ngrok.io", ".ngrok.app"],
  },
  plugins: [
    tailwindcss(),
    courvuxSsg({
      // Reuse the same routes that the client router consumes
      routes: async () => (await import("./src/routes-data.js")).default,
      baseUrl: "https://vanjexdev.github.io/courvux",
      notFound: async () => (await import("./src/pages/NotFound.js")).default,
      // Match createRouter options in src/router.js so router-link
      // emits correct hrefs in the static HTML.
      router: { mode: "history", base: "/courvux" },
      // Global components — same map registered on createApp(). Lets
      // the SSG render <code-block>, <my-card>, etc. into static HTML
      // instead of leaving the unprocessed custom-element tags.
      components: async () => ({
        "code-block": (await import("./src/components/CodeBlock.js")).CodeBlock,
      }),
    }),
  ],
  resolve: {
    alias: {
      courvux: path.resolve(__dirname, "../dist/index.js"),
    },
  },
  build: {
    outDir: "../docs",
    emptyOutDir: true,
  },
});
