<template>
  <div>{{ displayValue }}</div>
</template>

<script setup lang="ts">
import { ref, watch, reactive, computed } from "vue";
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
  decimals: number;
  useEasing: boolean;
}
const props = withDefaults(defineProps<propType>(), {
  startVal: 0,
  endVal: 2022,
  autoplay: true,
  duration: 5000,
  easingFn: (t, b, c, d) => {
    return (c * (-Math.pow(2, (-10 * t) / d) + 1) * 1024) / 1023 + b;
  },
  decimals: 0,
  useEasing: true,
});

const countDown = computed(() => {
  return props.startVal > props.endVal;
});

// 拷贝到新地址
const propsData = ref(Object.assign({}, props));

let displayValue = ref(props.startVal);

interface attrType {
  startTime: number | null;
  timestamp: number | null;
  progress: number | null;
  printVal: number | null;
  rAF: number | null;
}

const attr = reactive<attrType>({
  startTime: null,
  timestamp: null,
  progress: null,
  printVal: null,
  rAF: null,
});

const count: (timestamp: number) => void = (timestamp) => {
  if (!attr.startTime) attr.startTime = timestamp;
  attr.timestamp = timestamp;
  attr.progress = timestamp - attr.startTime;

  if (props.useEasing) {
    if (!countDown) {
      attr.printVal = props.easingFn(
        attr.progress,
        0,
        propsData.value.endVal - propsData.value.startVal,
        propsData.value.duration
      );
    } else {
      attr.printVal = props.easingFn(
        attr.progress,
        propsData.value.startVal,
        propsData.value.endVal - propsData.value.startVal,
        propsData.value.duration
      );
    }
  } else {
    if (!countDown) {
      attr.printVal = propsData.value.endVal-propsData.value.startVal/
    } else {
    }
  }

  displayValue.value = formatNum(attr.printVal);

  if (attr.progress <= props.duration) {
    attr.rAF = requestAnimationFrame(count);
  }
};

const start = () => {
  attr.rAF = requestAnimationFrame(count);
  console.log(attr.rAF);
};

const shop = () => {
  cancelAnimationFrame(attr.rAF as number);
};

//  保留相应位数的小数
const formatNum: (num: number) => number = (num) => {
  let newNum = parseInt(num.toFixed(props.decimals));
  return newNum;
};
//是否自动开启
watch(
  () => props.autoplay,
  () => {
    if (props.autoplay) {
      start();
    } else {
      console.log("停止了");
      shop();
    }
  },
  {
    immediate: true,
  }
);
</script>

<style scoped></style>
