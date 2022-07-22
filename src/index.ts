import CountUp from "./vueCountUp.vue";
export default CountUp;

if (typeof window !== "undefined" && window.vue) {
  window.Vue.component("count-up", CountUp);
}
