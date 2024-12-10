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
              <keep-alive :include="nameList">
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
import { ref, watch } from 'vue'
import { useRoute } from 'vue-router'
import { useTagsStore } from '@/stores/modules/tags'

const route = useRoute()
const tagsStore = useTagsStore()

let nameList = ref([])

watch(() => route.path, () => {
  // 对路由变化做出响应...
  nameList.value = tagsStore.tags.map(item => item.name)
  if (!nameList.value.includes(route.name)) {
    tagsStore.setTags({ title: route.meta.title, name: route.name, path: route.path })
  }
})

</script>

<style lang="less" scoped>
.layout {
  display: flex;

  .layout-right {
    flex: 1;

    .layout-content {
      padding: 10px;
    }
  }

  .content-views {
    height: calc(100vh - 130px);
  }
}
</style>