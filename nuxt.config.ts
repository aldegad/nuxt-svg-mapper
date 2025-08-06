import { fileURLToPath, resolve } from "url";
import tailwindcss from "@tailwindcss/vite";

export default defineNuxtConfig({
  compatibilityDate: "2025-05-15",
  devtools: { enabled: true },
  srcDir: "src/",
  css: ["~/assets/css/main.css"],
  modules: ["@nuxt/eslint", "@nuxt/test-utils/module", "@pinia/nuxt"],
  alias: {
    "~svg-mapper": fileURLToPath(new URL("./src", import.meta.url)),
  },
  components: [],
  imports: {
    scan: false,
  },
  devServer: {
    port: 3001,
  },
  ssr: false,
  nitro: {
    static: true,
  },
  vite: {
    plugins: [tailwindcss()],
    server: {
      fs: {
        allow: [resolve(__dirname, "../../")],
      },
    },
  },
});
