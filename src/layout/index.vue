<template>
  <div class="layout">
    <aside class="layout-sidebar" :class="settingStore.isCollapsed ? 'layout-sidebar-collapsed' : ''">
      <sidebar-container />
    </aside>
    <section class="layout-container">
      <header>
        <header-container class="layout-container-header" />
        <tags-container
          class="layout-container-tags"
          :class="settingStore.isCollapsed ? 'layout-container-tags-collapsed' : ''"
          v-show="config.ISTAGS"
        />
      </header>

      <section>
        <el-scrollbar class="layout-container-content">
          <router-view v-slot="{ Component }">
            <Transition name="slide-fade">
              <keep-alive :include="tagStore.tagList.map(item => item.name)">
                <component :is="Component" />
              </keep-alive>
            </Transition>
          </router-view>
        </el-scrollbar>
      </section>
    </section>
  </div>
</template>

<script setup>
import config from '@/config'
import sidebarContainer from './components/sidebar/index.vue'
import headerContainer from './components/header/index.vue'
import tagsContainer from './components/tags/index.vue'
import { useSettingStore } from '@/stores/modules/setting'
import { useTagStore } from '@/stores/modules/tag'
import { watch } from 'vue'

import { storeToRefs } from 'pinia'
import { useRoute } from 'vue-router'

const route = useRoute()

const tagStore = useTagStore()
const { tagList } = storeToRefs(tagStore)

const settingStore = useSettingStore()

watch(
  route,
  newVal => {
    let index = tagList.value.findIndex(item => item.name === newVal.name)
    if (index < 0) {
      tagStore.addTag({
        name: newVal.name,
        path: newVal.path,
        meta: newVal.meta
      })
    }
  },
  { deep: true, immediate: true }
)
</script>

<style lang="scss" scoped>
@use './index.scss' as *;
</style>
