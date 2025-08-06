export default defineNuxtPlugin(() => {
  document.addEventListener("contextmenu", (e) => {
    e.preventDefault();
  });
});
