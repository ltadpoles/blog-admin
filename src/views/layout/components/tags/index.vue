<template>
  <div class="tags">
    <el-tag class="tags-item"
            v-for="(tag, index) in tagsStore.tagList"
            :key="tag.name"
            size="large"
            :closable="index !== 0"
            :type="route.path === tag.path ? 'primary' : 'info'"
            @click="tagClick(tag, index)"
            @close="tagClose(tag, index)">
      <div class="tag">
        <el-icon :size="14" v-if="tag.icon && ENV.ISTAGICON">
          <component :is="tag.icon" />
        </el-icon>
        <span class="tag-title">
          {{ tag.title }}
        </span>
      </div>
    </el-tag>
  </div>

</template>

<script setup>
import { useTagsStore } from '@/stores/modules/tags'
import { ref, watch } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { ENV } from '@/config'

const router = useRouter()
const route = useRoute()
const tagsStore = useTagsStore()
const activeIndex = ref(0)

watch(route, (newVal) => {
  let index = tagsStore.tagList.findIndex(item => item.name === newVal.name)
  if (index < 0) {
    tagsStore.addTag({
      name: newVal.name,
      path: newVal.path,
      title: newVal.meta.title,
      icon: newVal.meta.icon
    })
  }
}, { deep: true, immediate: true })

const tagClick = (tag, index) => {
  // 重复点击标签，不跳转
  if (route.path === tag.path) {
    return
  }
  router.push(tag.path)
  activeIndex.value = index
}
const tagClose = (tag, index) => {
  tagsStore.delTag(tag)
  if (activeIndex.value === index) {
    // 关闭当前页面，返回前一个页面
    router.push(tagsStore.tagList[index - 1].path)
    activeIndex.value = index - 1
  }

}
</script>

<style lang="less" scoped>
.tags {
  margin-bottom: 10px;

  .tags-item {
    margin-right: 10px;
    cursor: pointer;

    .tag {
      display: flex;
      align-items: center;

      .tag-title {
        margin-left: 5px;
      }
    }
  }
}
</style>