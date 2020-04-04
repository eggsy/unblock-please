import Vue from "vue";
import App from "./App";

import "../plugins/tippy";
import "../plugins/vuetify";

new Vue({
  el: "#app",
  render: h => h(App)
});
