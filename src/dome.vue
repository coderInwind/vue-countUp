<template>
  <div>
    <vueCountUpVue
      :startVal="100"
      :endVal="1.5"
      :autoplay="flag"
      :decimals="2"
      :useEasing="true"
    ></vueCountUpVue>
    <button @click="btnClick">切换</button>
  </div>
</template>

<script setup lang="ts">
import { ref, Ref } from "vue";
import vueCountUpVue from "./vueCountUp.vue";

const flag: Ref<boolean> = ref(false);

const btnClick = () => {
  flag.value = !flag.value;
  console.log(flag.value);
};
</script>

<style scoped></style>
