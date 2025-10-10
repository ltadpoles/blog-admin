<template>
  <div class="echart-container">
    <div class="echart-header">
      <h3 class="echart-title">用户访问趋势</h3>
      <div class="echart-controls">
        <div class="period-tabs">
          <div class="period-tab" :class="{ active: selectedPeriod === '7' }" @click="handlePeriodClick('7')">7天</div>
          <div class="period-tab" :class="{ active: selectedPeriod === '30' }" @click="handlePeriodClick('30')">
            30天
          </div>
        </div>
      </div>
    </div>
    <div class="echart-content" ref="echartLineRef"></div>
  </div>
</template>

<script setup>
import { useTemplateRef, onMounted, onUnmounted, watch, nextTick, ref } from 'vue'
import { useSettingStore } from '@/stores/modules/setting'
import { getVisitTrend } from '@/api'
import * as echarts from 'echarts'

const settingStore = useSettingStore()
const echartLineRef = useTemplateRef('echartLineRef')
const selectedPeriod = ref('7')

let timer = null
let chartRef = null

const chartResize = () => {
  chartRef && chartRef.resize({ animation: { duration: 200 } })
}

const initChart = async () => {
  if (!echartLineRef.value) {
    return
  }
  chartRef = echarts.init(echartLineRef.value)

  try {
    // 获取访问趋势数据
    const { data } = await getVisitTrend({ days: selectedPeriod.value })
    const trendData = data?.data || data

    // 解析数据格式
    let dates = []
    let visits = []

    if (trendData?.trend && Array.isArray(trendData.trend)) {
      // 接口返回格式: { trend: [{ date: '2025-10-04', count: 0 }, ...] }
      dates = trendData.trend.map(item => item.date || '')
      visits = trendData.trend.map(item => item.count || 0)
    } else if (Array.isArray(trendData)) {
      // 直接数组格式: [{ date: '2024-01-01', count: 120 }, ...]
      dates = trendData.map(item => item.date || item.time || item.day || '')
      visits = trendData.map(item => item.count || item.visits || item.value || 0)
    } else if (trendData?.dates && trendData?.visits) {
      // 对象格式: { dates: [...], visits: [...] }
      dates = trendData.dates
      visits = trendData.visits
    }

    chartRef.setOption({
      tooltip: {
        trigger: 'axis'
      },
      grid: {
        left: '3%',
        right: '4%',
        bottom: '3%',
        containLabel: true
      },
      xAxis: {
        type: 'category',
        boundaryGap: false,
        data: dates
      },
      yAxis: {
        type: 'value'
      },
      series: [
        {
          name: '访问量',
          type: 'line',
          smooth: true,
          data: visits,
          areaStyle: {
            color: {
              type: 'linear',
              x: 0,
              y: 0,
              x2: 0,
              y2: 1,
              colorStops: [
                { offset: 0, color: 'rgba(64, 158, 255, 0.3)' },
                { offset: 1, color: 'rgba(64, 158, 255, 0.05)' }
              ]
            }
          },
          lineStyle: {
            width: 2,
            color: '#409EFF'
          },
          itemStyle: {
            color: '#409EFF'
          }
        }
      ]
    })
  } catch {
    // 加载失败时显示空图表
    chartRef.setOption({
      xAxis: {
        type: 'category',
        data: []
      },
      yAxis: {
        type: 'value'
      },
      series: [
        {
          type: 'line',
          data: []
        }
      ]
    })
  }

  window.addEventListener('resize', chartResize)
}

// 处理时间段点击
const handlePeriodClick = period => {
  selectedPeriod.value = period
  initChart()
}

watch(
  () => settingStore.isCollapsed,
  () => {
    timer = setTimeout(() => {
      chartResize()
    }, 300)
  }
)

onMounted(async () => {
  await nextTick()
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
