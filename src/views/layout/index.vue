<template>
  <section class="layout">
    <section class="layout-sidebar">
      <v-sidebar />
    </section>
    <el-scrollbar class="content-views" wrap-class="wrap-sty">
      <router-view v-slot="{ Component }">
        <transition name="slide-fade">
          <component :is="Component" />
        </transition>
      </router-view>
    </el-scrollbar>
  </section>

</template>

<script setup>
import vSidebar from './components/sidebar/index.vue'
</script>

<style lang="less" scoped>
.layout {
  display: flex;
  .layout-sidebar {
    width: 200px;
  }
}
</style>