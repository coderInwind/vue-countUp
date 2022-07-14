<template>
  <div>{{ props.startVal }}</div>
</template>

<script setup>

const props = defineProps({
  startVal: Number,
  endVal:Number
});
</script>

<style scoped></style>
