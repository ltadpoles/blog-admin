<template>
  <section class="layout">
    <v-sidebar />
    <div class="layout-content">
      <v-header />
      <el-scrollbar class="content-views" wrap-class="wrap-class">
        <router-view v-slot="{ Component }">
          <transition name="slide-fade">
            <component :is="Component" />
          </transition>
        </router-view>
      </el-scrollbar>
    </div>
  </section>

</template>

<script setup>
import vSidebar from './components/sidebar/index.vue'
import vHeader from './components/header/index.vue'
</script>

<style lang="less" scoped>
.layout {
  display: flex;

  .layout-content {
    flex: 1;
  }

  .content-views {
    height: calc(100vh - 60px);
  }
}
</style>