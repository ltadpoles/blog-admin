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

    <div class="echart-grid">
      <div class="echart-item">
        <line-echart />
      </div>
      <div class="echart-item">
        <pie-echart :category-data="info.categories" />
      </div>
    </div>
  </div>
</template>

<script setup>
import { onMounted, ref } from 'vue'
import lineEchart from './line/index.vue'
import pieEchart from './pie/index.vue'
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

.echart-grid {
  display: grid;
  grid-template-columns: 2fr 1fr;
  gap: 20px;
  margin-top: 20px;

  .echart-item {
    padding: 20px;
    background: #fff;
    border-radius: 8px;
    box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
  }
}
</style>
