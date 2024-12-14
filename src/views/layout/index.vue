<template>
  <section class="layout">
    <v-sidebar />
    <div class="layout-right">
      <v-header />
      <div class="layout-content">
        <v-tags />
        <el-scrollbar class="content-views" wrap-class="wrap-class">
          <router-view v-slot="{ Component }">
            <transition name="slide-fade">
              <keep-alive :include="tagsStore.tagList.map(item => item.name)">
                <component :is="Component" />
              </keep-alive>
            </transition>
          </router-view>
        </el-scrollbar>
      </div>
    </div>
  </section>

</template>

<script setup>
import vSidebar from './components/sidebar/index.vue'
import vHeader from './components/header/index.vue'
import vTags from './components/tags/index.vue'
import { useTagsStore } from '@/stores/modules/tags'

const tagsStore = useTagsStore()

</script>

<style lang="less" scoped>
.layout {
  display: flex;
  background-color: var(--el-bg-color-page);

  .layout-right {
    flex: 1;
    overflow: hidden;

    .layout-content {
      padding: 10px;
    }
  }

  .content-views {
    height: calc(100vh - 130px);
  }
}
</style>