<template>
  <div class="index">
    <div class="echart-box" ref="echartBox" style="width: 500px; height: 500px"></div>
  </div>
</template>

<script setup>
import * as echarts from 'echarts'
import { ref, onMounted } from 'vue'

const echartBox = ref(null)

onMounted(() => {
  // 基于准备好的dom，初始化echarts实例
  const myChart = echarts.init(echartBox.value)
  // 绘制图表
  myChart.setOption({
    title: {
      text: 'ECharts 入门示例'
    },
    tooltip: {},
    xAxis: {
      data: ['衬衫', '羊毛衫', '雪纺衫', '裤子', '高跟鞋', '袜子']
    },
    yAxis: {},
    series: [
      {
        name: '销量',
        type: 'bar',
        data: [5, 20, 36, 10, 10, 20]
      }
    ]
  })
})
</script>

<style lang="scss" scoped>
@use './index.scss' as *;
</style>
