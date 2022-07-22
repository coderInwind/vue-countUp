<template>
  <div>{{ displayValue }}</div>
</template>

<script setup lang="ts">
import {
  ref,
  watch,
  reactive,
  computed,
  onUnmounted,
  onMounted,
  defineExpose,
  defineEmits,
} from "vue";
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
  decimals?: number;
  useEasing?: boolean;
  separator?: string;
  prefix?: string;
  suffix?: string;
  pause?: boolean;
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
  prefix: "",
  suffix: "",
  pause: false,
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
  remaining: number | null;
  pause: boolean | null;
  localStartVal: number;
  localDuration: number;
}

const attr = reactive<attrType>({
  startTime: null,
  timestamp: null,
  progress: null,
  printVal: null,
  rAF: null,
  remaining: null,
  pause: props.pause,
  localStartVal: props.startVal,
  localDuration: props.duration,
});

const emit = defineEmits();

const count: (timestamp: number) => void = (timestamp) => {
  if (!attr.startTime) attr.startTime = timestamp;
  attr.timestamp = timestamp;
  attr.progress = timestamp - attr.startTime;
  attr.remaining = attr.localDuration - attr.progress;

  if (props.useEasing) {
    if (!countDown) {
      attr.printVal = props.easingFn(
        attr.progress,
        0,
        propsData.value.endVal - attr.localStartVal,
        propsData.value.duration
      );
    } else {
      attr.printVal = props.easingFn(
        attr.progress,
        attr.localStartVal,
        propsData.value.endVal - attr.localStartVal,
        propsData.value.duration
      );
    }
  } else {
    if (!countDown) {
      attr.printVal =
        attr.localStartVal +
        (attr.localStartVal - propsData.value.endVal) *
          (attr.progress / props.duration);
    } else {
      attr.printVal =
        attr.localStartVal -
        (attr.localStartVal - propsData.value.endVal) *
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
  } else {
    emit("complete");
  }
};

const start = () => {
  attr.localStartVal = props.startVal;
  attr.startTime = null;
  attr.localDuration = props.duration;
  attr.pause = false;
  attr.rAF = requestAnimationFrame(count);
};

const resume = () => {
  attr.startTime = null;
  attr.localDuration = attr.remaining as number;
  attr.localStartVal = attr.printVal as number;
  requestAnimationFrame(count);
};

const pause = () => {
  cancelAnimationFrame(attr.rAF as number);
};

const reset = () => {
  attr.startTime = null;
  displayValue.value = formatNum(props.startVal);
  cancelAnimationFrame(attr.rAF as number);
};

const formatNum: (num: number) => string = (num) => {
  let numArr: string[] = num.toFixed(props.decimals).split(".");
  let num1 = numArr[0];
  let num2 = numArr[1];
  let formatNum =
    props.prefix +
    num1 +
    (numArr.length > 1 ? props.separator : "") +
    num2 +
    props.suffix;

  return formatNum;
};

onMounted(() => {
  if (props.autoplay) {
    start();
    emit("mountedCallback")
  }
});

watch(
  () => props.startVal,
  () => {
    if (props.autoplay) {
      start();
    }
  }
);
watch(
  () => props.endVal,
  () => {
    if (props.autoplay) {
      start();
    }
  }
);
watch(
  () => props.pause,
  () => {
    if (props.pause) {
      pause();
    } else {
      resume();
    }
  }
);

onUnmounted(() => {
  cancelAnimationFrame(attr.rAF as number);
});

//暴露方法
defineExpose({
  start,
  reset,
});
</script>

<style scoped></style>
