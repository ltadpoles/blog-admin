<template>
  <div class="logo">
    <el-icon :size="20">
      <!-- eslint-disable vue/require-component-is -->
      <component is="Shop" />
    </el-icon>

    <h3 class="admin-title" v-show="!settingStore.isCollapsed">管理系统</h3>
  </div>
</template>
<script setup>
import { useSettingStore } from '@/stores/modules/setting'
const settingStore = useSettingStore()
</script>
<style lang="less" scoped>
.logo {
  height: 68px;
  display: flex;
  justify-content: center;
  align-items: center;

  .admin-title {
    margin-left: 8px;
  }
}
</style>
