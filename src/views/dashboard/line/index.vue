<template>
  <div class="echart-content" ref="echartLineRef"></div>
</template>

<script setup>
import { useTemplateRef, onMounted, onUnmounted, watch } from 'vue'
import { useSettingStore } from '@/stores/modules/setting'
import * as echarts from 'echarts'

const settingStore = useSettingStore()
const echartLineRef = useTemplateRef('echartLineRef')

let timer = null
let chartRef = null

const chartResize = () => {
  chartRef && chartRef.resize({ animation: { duration: 200 } })
}
const initChart = () => {
  chartRef = echarts.init(echartLineRef.value)
  chartRef.setOption({
    tooltip: {
      trigger: 'axis'
    },
    legend: {
      data: ['邮件营销', '联盟广告', '视频广告'],
      textStyle: {
        color: '#666'
      }
    },
    grid: {
      left: '3%',
      right: '4%',
      bottom: '3%',
      containLabel: true
    },
    toolbox: {
      feature: {
        saveAsImage: {}
      }
    },
    xAxis: {
      type: 'category',
      boundaryGap: false,
      data: ['周一', '周二', '周三', '周四', '周五', '周六', '周日']
    },
    yAxis: {
      type: 'value'
    },
    series: [
      {
        name: '邮件营销',
        type: 'line',
        data: [120, 132, 101, 134, 90, 230, 210]
      },
      {
        name: '联盟广告',
        type: 'line',
        data: [220, 182, 191, 234, 290, 330, 310]
      },
      {
        name: '视频广告',
        type: 'line',
        data: [150, 232, 201, 154, 190, 330, 410]
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
