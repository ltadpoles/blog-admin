<template>
  <div class="dashboard">
    <div class="dashboard-box">
      <div class="dashboard-box-item">
        <div class="dashboard-box-item-content">
          <div class="dashboard-box-item-title">文章</div>
          <div class="dashboard-box-item-value">{{ info.articles }}</div>
        </div>
        <div class="dashboard-box-item-svg">
          <SvgIcon name="article" width="30" height="30" marginRight="10px" />
        </div>
      </div>
      <div class="dashboard-box-item">
        <div class="dashboard-box-item-content">
          <div class="dashboard-box-item-title">标签</div>
          <div class="dashboard-box-item-value">{{ info.tags?.length }}</div>
        </div>
        <div class="dashboard-box-item-svg">
          <SvgIcon name="tags" width="30" height="30" marginRight="10px" />
        </div>
      </div>
      <div class="dashboard-box-item">
        <div class="dashboard-box-item-content">
          <div class="dashboard-box-item-title">分类</div>
          <div class="dashboard-box-item-value">{{ info.categories?.length }}</div>
        </div>
        <div class="dashboard-box-item-svg">
          <SvgIcon name="category" width="30" height="30" marginRight="10px" />
        </div>
      </div>
      <div class="dashboard-box-item">
        <div class="dashboard-box-item-content">
          <div class="dashboard-box-item-title">访问量</div>
          <div class="dashboard-box-item-value">{{ website.stats?.totalVisits }}</div>
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
import { countArticlesByType } from '@/api/article'
import { websiteInfo } from '@/api'

const info = ref({})
const website = ref({})
/**
 * 获取文章信息
 */
const getStats = async () => {
  const { data } = await countArticlesByType()
  info.value = data.data
}

/**
 * 获取文章信息
 */
const getWebsiteInfo = async () => {
  const { data } = await websiteInfo()
  website.value = data.data
}

onMounted(() => {
  getStats()
  getWebsiteInfo()
})
</script>

<style lang="scss" scoped>
@use './index.scss' as *;
</style>
