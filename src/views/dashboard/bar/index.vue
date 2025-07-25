<template>
  <div class="dashboard-echart">
    <div class="dashboard-echart-title">
      <div class="dashboard-echart-title-left">
        <span>用户访问趋势</span>
      </div>
      <SvgIcon name="fullscreen" @click="toggle()" />
    </div>
    <el-divider />
    <div class="dashboard-echart-content" ref="echartContainerRef"></div>
  </div>
</template>

<script setup>
import * as echarts from 'echarts'
import { useTemplateRef, watch, onMounted, onUnmounted } from 'vue'
import { useFullscreen } from '@vueuse/core'
import { useSettingStore } from '@/stores/modules/setting'

const echartContainerRef = useTemplateRef('echartContainerRef')
const { toggle } = useFullscreen(echartContainerRef)

const settingStore = useSettingStore()

let chartRef = null
let timer = null
const chartResize = () => {
  chartRef && chartRef.resize({ animation: { duration: 200 } })
}
const initChart = () => {
  chartRef = echarts.init(echartContainerRef.value)
  chartRef.setOption({
    tooltip: {
      trigger: 'axis',
      axisPointer: {
        // 坐标轴指示器，坐标轴触发有效
        type: 'shadow' // 默认为直线，可选为：'line' | 'shadow'
      }
    },
    legend: {
      data: ['直接访问', '邮件营销', '联盟广告', '视频广告', '搜索引擎', '百度', '谷歌', '必应', '其他'],
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
    xAxis: [
      {
        type: 'category',
        data: ['周一', '周二', '周三', '周四', '周五', '周六', '周日']
      }
    ],
    yAxis: [
      {
        type: 'value'
      }
    ],
    series: [
      {
        name: '直接访问',
        type: 'bar',
        data: [320, 332, 301, 334, 390, 330, 320]
      },
      {
        name: '邮件营销',
        type: 'bar',
        stack: '广告',
        data: [120, 132, 101, 134, 90, 230, 210]
      },
      {
        name: '联盟广告',
        type: 'bar',
        stack: '广告',
        data: [220, 182, 191, 234, 290, 330, 310]
      },
      {
        name: '视频广告',
        type: 'bar',
        stack: '广告',
        data: [150, 232, 201, 154, 190, 330, 410]
      },
      {
        name: '搜索引擎',
        type: 'bar',
        data: [862, 1018, 964, 1026, 1679, 1600, 1570],
        markLine: {
          data: [[{ type: 'min' }, { type: 'max' }]]
        }
      },
      {
        name: '百度',
        type: 'bar',
        barWidth: 5,
        stack: '搜索引擎',
        data: [620, 732, 701, 734, 1090, 1130, 1120]
      },
      {
        name: '谷歌',
        type: 'bar',
        stack: '搜索引擎',
        data: [120, 132, 101, 134, 290, 230, 220]
      },
      {
        name: '必应',
        type: 'bar',
        stack: '搜索引擎',
        data: [60, 72, 71, 74, 190, 130, 110]
      },
      {
        name: '其他',
        type: 'bar',
        stack: '搜索引擎',
        data: [62, 82, 91, 84, 109, 110, 120]
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
