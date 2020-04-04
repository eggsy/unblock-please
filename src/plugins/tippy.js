import Vue from "vue";
import tippy from "vue-tippy";

Vue.use(tippy, {
  directive: "tippy",
  theme: "discord",
  arrow: true,
  inertia: true,
  animation: "discord-anim",
  duration: [100, 100],
  hideOnClick: false
});