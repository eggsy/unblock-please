import Vue from "vue";
import "./tailwind.scss";

// @ts-ignore-next-line
import App from "./App.vue";

new Vue({
  el: "#app",
  render: (h) => h(App),
});
