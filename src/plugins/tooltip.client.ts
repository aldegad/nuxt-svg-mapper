import { tooltip } from "~svg-mapper/directives/tooltip";

export default defineNuxtPlugin((nuxtApp) => {
  nuxtApp.vueApp.directive("tooltip", tooltip);
});
