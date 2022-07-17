<template>
  <div>{{ displayValue }}</div>
</template>

<script setup lang="ts">
import { ref, watch, Ref, reactive } from "vue";
import {
  requestAnimationFrame,
  cancelAnimationFrame,
} from "./animationCompatibility";

interface propType {
  startVal?: number;
  endVal?: number;
  autoplay?: boolean;
  startTime?: number;
  duration?: number;
  easingFn?: (t: number, b: number, c: number, d: number) => number;
}
const props = withDefaults(defineProps<propType>(), {
  startVal: 0,
  endVal: 2022,
  autoplay: true,
  duration: 3000,
  easingFn: (t, b, c, d) => {
    return (c * (-Math.pow(2, (-10 * t) / d) + 1) * 1024) / 1023 + b;
  },
});
// 拷贝到新地址
const propsData = ref(Object.assign({}, props));

let displayValue = ref(props.startVal);

interface attrType {
  startTime: number | null;
  timestamp: number | null;
  progress: number | null;
  printVal: number | null;
}

const attr = reactive<attrType>({
  startTime: null,
  timestamp: null,
  progress: null,
  printVal: null,
});

const count: (timestamp: number) => void = (timestamp) => {
  if (!attr.startTime) attr.startTime = timestamp;

  attr.timestamp = timestamp;

  attr.progress = timestamp - attr.startTime;

  attr.printVal = props.easingFn(
    attr.progress,
    propsData.value.startVal,
    propsData.value.endVal - propsData.value.startVal,
    propsData.value.duration
  );

  displayValue.value = attr.printVal;
  requestAnimationFrame(count);
};

const start = () => {
  requestAnimationFrame(count);
};

const formatNum = (number) => {
  const reg = /\./;

  console.log(number.replace(reg));
};
//是否自动开启
watch(
  () => props.autoplay,
  () => {
    if (props.autoplay) {
      start();
    } else {
    }
  },
  {
    immediate: true,
  }
);
</script>

<style scoped></style>
