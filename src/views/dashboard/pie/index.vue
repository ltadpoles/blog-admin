<template>
  <div class="echart-container">
    <div class="echart-header">
      <h3 class="echart-title">文章分类统计</h3>
    </div>
    <div class="echart-content" ref="echartPieRef"></div>
  </div>
</template>

<script setup>
import { useTemplateRef, onMounted, onUnmounted, watch, nextTick } from 'vue'
import { useSettingStore } from '@/stores/modules/setting'
import * as echarts from 'echarts'

const props = defineProps({
  categoryData: {
    type: Array,
    default: () => []
  }
})

const settingStore = useSettingStore()
const echartPieRef = useTemplateRef('echartPieRef')

let timer = null
let chartRef = null

const chartResize = () => {
  chartRef && chartRef.resize({ animation: { duration: 200 } })
}

const initChart = () => {
  if (!echartPieRef.value) {
    return
  }
  chartRef = echarts.init(echartPieRef.value)

  // 使用传入的分类数据
  const categoryData = props.categoryData || []

  // 解析数据格式
  const pieData = categoryData.map(item => ({
    name: item.name,
    value: item.articleCount
  }))

  chartRef.setOption({
    tooltip: {
      trigger: 'item',
      formatter: '{b}: {c}篇 ({d}%)'
    },
    legend: {
      orient: 'horizontal',
      bottom: '5%',
      left: 'center',
      textStyle: {
        fontSize: 11
      }
    },
    series: [
      {
        name: '文章分类',
        type: 'pie',
        radius: ['40%', '60%'],
        center: ['50%', '45%'],
        avoidLabelOverlap: false,
        itemStyle: {
          borderRadius: 6,
          borderColor: '#fff',
          borderWidth: 1
        },
        label: {
          show: false
        },
        emphasis: {
          itemStyle: {
            shadowBlur: 10,
            shadowOffsetX: 0,
            shadowColor: 'rgba(0, 0, 0, 0.5)'
          }
        },
        labelLine: {
          show: false
        },
        data: pieData
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

onMounted(async () => {
  await nextTick()
  initChart()
})

// 监听数据变化，重新渲染图表
watch(
  () => props.categoryData,
  () => {
    if (chartRef) {
      initChart()
    }
  },
  { deep: true }
)

onUnmounted(() => {
  timer && clearTimeout(timer)
  timer = null
  window.removeEventListener('resize', chartResize)
})
</script>

<style lang="scss" scoped>
@use './index.scss' as *;
</style>
