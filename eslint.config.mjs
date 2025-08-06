// @ts-check
import withNuxt from "./.nuxt/eslint.config.mjs";
import skipFormatting from "@vue/eslint-config-prettier/skip-formatting";

export default withNuxt(skipFormatting, {
  rules: {
    "vue/html-self-closing": "off",
    "vue/no-undef-components": [
      "error",
      {
        ignorePatterns: [
          "ClientOnly",
          "NuxtLayout",
          "NuxtPage",
          "NuxtLink",
          "swiper-container",
          "swiper-slide",
          "router-link",
          "RouterView",
        ],
      },
    ],
    "vue/multi-word-component-names": "off",
    "@typescript-eslint/no-unused-vars": "warn",
    "@typescript-eslint/no-empty-object-type": "off",
    "vue/require-default-prop": "off",
  },
});
