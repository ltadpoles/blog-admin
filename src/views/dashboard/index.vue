<template>
  <div class="dashboard">
    <div class="dashboard-box">
      <div class="dashboard-box-item">
        <div class="dashboard-box-item-content">
          <div class="dashboard-box-item-title">文章</div>
          <div class="dashboard-box-item-value">{{ statsInfo.articles?.total }}</div>
        </div>
        <div class="dashboard-box-item-svg">
          <SvgIcon name="article" width="30" height="30" marginRight="10px" />
        </div>
      </div>
      <div class="dashboard-box-item">
        <div class="dashboard-box-item-content">
          <div class="dashboard-box-item-title">标签</div>
          <div class="dashboard-box-item-value">{{ statsInfo.tags?.total }}</div>
        </div>
        <div class="dashboard-box-item-svg">
          <SvgIcon name="tags" width="30" height="30" marginRight="10px" />
        </div>
      </div>
      <div class="dashboard-box-item">
        <div class="dashboard-box-item-content">
          <div class="dashboard-box-item-title">分类</div>
          <div class="dashboard-box-item-value">{{ statsInfo.categories?.total }}</div>
        </div>
        <div class="dashboard-box-item-svg">
          <SvgIcon name="category" width="30" height="30" marginRight="10px" />
        </div>
      </div>
      <div class="dashboard-box-item">
        <div class="dashboard-box-item-content">
          <div class="dashboard-box-item-title">访问量</div>
          <div class="dashboard-box-item-value">0</div>
        </div>
        <div class="dashboard-box-item-svg">
          <SvgIcon name="visit" width="30" height="30" marginRight="10px" />
        </div>
      </div>
    </div>
    <bar-echart />

    <div class="echart-list">
      <div class="echart-list-item">
        <line-echart />
      </div>
      <div class="echart-list-item">
        <pie-echart />
      </div>
      <div class="echart-list-item">
        <scatter-echart />
      </div>
      <div class="echart-list-item">
        <pictorial-bar-echart />
      </div>
    </div>
  </div>
</template>

<script setup>
import { onMounted, ref } from 'vue'
import barEchart from './bar/index.vue'
import lineEchart from './line/index.vue'
import pieEchart from './pie/index.vue'
import scatterEchart from './scatter/index.vue'
import pictorialBarEchart from './pictorial-bar/index.vue'
import { stats } from '@/api/article'

const statsInfo = ref({})

const getStats = async () => {
  let { data } = await stats()
  statsInfo.value = data.data
}
onMounted(() => {
  getStats()
})
</script>

<style lang="scss" scoped>
@use './index.scss' as *;
</style>
