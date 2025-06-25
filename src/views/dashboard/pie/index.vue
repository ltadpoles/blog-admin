<template>
  <div class="echart-content" ref="echartPieRef"></div>
</template>

<script setup>
import { useTemplateRef, onMounted, onUnmounted, watch } from 'vue'
import { useSettingStore } from '@/stores/modules/setting'
import * as echarts from 'echarts'

const settingStore = useSettingStore()
const echartPieRef = useTemplateRef('echartPieRef')

let timer = null
let chartRef = null

const chartResize = () => {
  chartRef && chartRef.resize({ animation: { duration: 200 } })
}
const initChart = () => {
  chartRef = echarts.init(echartPieRef.value)
  chartRef.setOption({
    tooltip: {
      trigger: 'item',
      formatter: '{a} <br/>{b} : {c} ({d}%)'
    },
    legend: {
      orient: 'vertical',
      left: 'left',
      data: ['直接访问', '邮件营销', '联盟广告', '视频广告', '搜索引擎'],
      textStyle: {
        color: '#666'
      }
    },
    series: [
      {
        name: '访问来源',
        type: 'pie',
        radius: '55%',
        center: ['50%', '60%'],
        data: [
          { value: 335, name: '直接访问' },
          { value: 310, name: '邮件营销' },
          { value: 234, name: '联盟广告' },
          { value: 135, name: '视频广告' },
          { value: 1548, name: '搜索引擎' }
        ]
      }
    ]
  })
  window.addEventListener('resize', chartResize)
}

watch(
  () => settingStore.isCollapsed,
  () => {
    timer = setTimeout(() => {
      chartResize()
    }, 300)
  }
)

onMounted(() => {
  initChart()
})

onUnmounted(() => {
  timer && clearTimeout(timer)
  timer = null
  window.removeEventListener('resize', chartResize)
})
</script>

<style lang="scss" scoped>
@use './index.scss' as *;
</style>
