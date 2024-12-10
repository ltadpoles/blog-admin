<template>
  <div class="tags">
    <el-tag class="tags-item"
            v-for="(tag, index) in tagsStore.tags"
            :key="tag.name"
            size="large"
            :closable="index !== 0"
            :type="route.path === tag.path ? 'primary' : 'info'"
            @click="tagClick(tag, index)"
            @close="tagClose(tag, index)">
      {{ tag.title }}
    </el-tag>
  </div>

</template>

<script setup>
import { useTagsStore } from '@/stores/modules/tags'
import { ref } from 'vue'
import { useRoute, useRouter } from 'vue-router'

const router = useRouter()
const route = useRoute()
const tagsStore = useTagsStore()
const activeIndex = ref(0)
const tagClick = (tag, index) => {
  router.push(tag.path)
  activeIndex.value = index
}
const tagClose = (tag, index) => {
  tagsStore.delTag(tag)
  if (activeIndex.value === index) {
    // 如果关闭当前打开的页面，返回前一个页面
    router.push(tagsStore.tags[index - 1].path)
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
    }
}
</style>