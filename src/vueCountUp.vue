<template>
  <div>{{ displayValue }}</div>
</template>

<script setup lang="ts">
import { ref, watch, reactive, computed, onUnmounted } from "vue";
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
  separator: string;
}
const props = withDefaults(defineProps<propType>(), {
  startVal: 0,
  endVal: 2022,
  autoplay: true,
  duration: 3000,
  easingFn: (t, b, c, d) => {
    return (c * (-Math.pow(2, (-10 * t) / d) + 1) * 1024) / 1023 + b;
  },
  decimals: 0,
  useEasing: true,
  separator: ",",
});

const countDown = computed(() => {
  return props.startVal > props.endVal;
});

// 拷贝到新地址
const propsData = ref(Object.assign({}, props));

let displayValue = ref<number | string>(props.startVal);

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
      attr.printVal =
        propsData.value.startVal +
        (propsData.value.startVal - propsData.value.endVal) *
          (attr.progress / props.duration);
    } else {
      attr.printVal =
        propsData.value.startVal -
        (propsData.value.startVal - propsData.value.endVal) *
          (attr.progress / props.duration);
    }
  }

  if (countDown) {
    attr.printVal = attr.printVal > props.endVal ? attr.printVal : props.endVal;
  } else {
    attr.printVal = attr.printVal < props.endVal ? attr.printVal : props.endVal;
  }

  displayValue.value = formatNum(attr.printVal);
  if (attr.progress < props.duration) {
    attr.rAF = requestAnimationFrame(count);
  }
};

const start = () => {
  attr.rAF = requestAnimationFrame(count);
};

const shop = () => {
  cancelAnimationFrame(attr.rAF as number);
};

const formatNum: (num: number) => string = (num) => {
  let numArr: string[] = num.toFixed(props.decimals).split(".");
  let num1 = numArr[0];
  let num2 = numArr[1];
  let formatNum = num1 + (numArr.length > 1 ? props.separator : "") + num2;

  return formatNum;
};

//是否自动开启
watch(
  () => props.autoplay,
  () => {
    if (props.autoplay) {
      start();
    } else {
      shop();
    }
  },
  {
    immediate: true,
  }
);

onUnmounted(() => {
  cancelAnimationFrame(attr.rAF as number);
});
</script>

<style scoped></style>
