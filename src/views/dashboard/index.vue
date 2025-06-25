<template>
  <div class="dashboard">
    <div class="dashboard-box">
      <div class="dashboard-box-item weixin">
        <div class="dashboard-box-item-svg">
          <SvgIcon name="weixin" width="50" height="50" marginRight="10px" />
        </div>
        <div class="dashboard-box-item-content">
          <div class="dashboard-box-item-value">1000</div>
          <div class="dashboard-box-item-title">微信</div>
        </div>
      </div>
      <div class="dashboard-box-item qq">
        <div class="dashboard-box-item-svg">
          <SvgIcon name="qq" width="50" height="50" marginRight="10px" />
        </div>
        <div class="dashboard-box-item-content">
          <div class="dashboard-box-item-value">320</div>
          <div class="dashboard-box-item-title">QQ</div>
        </div>
      </div>
      <div class="dashboard-box-item douyin">
        <div class="dashboard-box-item-svg">
          <SvgIcon name="douyin" width="50" height="50" marginRight="10px" />
        </div>
        <div class="dashboard-box-item-content">
          <div class="dashboard-box-item-value">867</div>
          <div class="dashboard-box-item-title">抖音</div>
        </div>
      </div>
      <div class="dashboard-box-item weibo">
        <div class="dashboard-box-item-svg">
          <SvgIcon name="weibo" width="50" height="50" marginRight="10px" />
        </div>
        <div class="dashboard-box-item-content">
          <div class="dashboard-box-item-value">382</div>
          <div class="dashboard-box-item-title">微博</div>
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
import barEchart from './bar/index.vue'
import lineEchart from './line/index.vue'
import pieEchart from './pie/index.vue'
import scatterEchart from './scatter/index.vue'
import pictorialBarEchart from './pictorial-bar/index.vue'
</script>

<style lang="scss" scoped>
@use './index.scss' as *;
</style>
