<template>
  <div>
    <vueCountUpVue
      :startVal="12.5"
      :endVal="100.5"
      :autoplay="flag"
    ></vueCountUpVue>
    <button @click="btnClick">切换</button>
  </div>
</template>

<script setup lang="ts">
import { ref, Ref } from "vue";
import vueCountUpVue from "./vueCountUp.vue";

const flag: Ref<boolean> = ref(false);

const btnClick = () => {
  flag.value = true;
};
</script>

<style scoped></style>
