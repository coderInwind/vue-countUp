# vue-countUp

### How to use?
```bash
npm install vue-count-up-next
```

 [![vue3](https://img.shields.io/badge/vue-3.x-brightgreen.svg)](https://vuejs.org/)
 [![vue3](https://img.shields.io/badge/TypeScript-brightgreen.svg)](https://vuejs.org/)
 [![license](https://img.shields.io/github/license/mashape/apistatus.svg)](https://github.com/coderLgee/vue-countUp)


### Example

```vue
<template>
  <countUp :startVal='startVal' :endVal='endVal' :duration='3000'></countUp>
</template>

<script lang = "ts" setup>
  import {ref} from vue
  import countUp from 'vue-count-up';
  let startVal:number = ref(0)
  let endVal:number = ref(2022)
</script>
```
demo:



### Options
|    属性    |    说明   |   类型   |	默认值	|
| -----------------  | ---------------- | :--------: | :----------: |
| startVal       | 开始的值 |Number| 0 |
| endVal         | 结束的值 |Number | 2022 |
| duration  | 持续时间 | Number | 3000 |
| autoplay     | 挂载完成后自动开始 | Boolean | true |
| pause | 暂停/继续 | Boolean | false |
| decimals     | 小数的位数 | Number | 0 |
| separator     | 分隔整数和小数的符号 | String | , |
| prefix     | 前缀 | String | '' |
| suffix     | 后缀 | String | '' |
| useEasing     | 变速（默认逐渐缓慢） | Boolean | true |
| easingFn     | 自定义变速函数 | Function | — |


### Functions
| Function Name | Description   |
| :--------:   | -----  |
|    mountedCallback    |  组件挂载时的回调  |
| complete | 完成时的回调 |
|    start    |  开始 |
|    reset    |  重置 |
