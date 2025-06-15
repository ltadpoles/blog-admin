<template>
  <div class="tags" ref="tagsRef">
    <div class="arrow-left" v-show="isArrowShow">
      <SvgIcon name="arrow-left" @click="moveLeft" />
    </div>
    <div class="tags-scroll" ref="tagsScrollRef">
      <div class="tags-content" :style="`transform: translateX(${translateX}px)`">
        <div
          class="tags-item"
          :class="index === activeIndex ? 'tags-item-active' : ''"
          ref="tagsItemRef"
          @click="tagClick(tag)"
          v-for="(tag, index) in tagList"
          :key="tag.path"
        >
          <SvgIcon v-if="config.ISTAGSICON" :name="tag?.meta?.icon" marginRight="3px" />
          <span>{{ $t(`messages.${tag?.meta?.i18nName}`) }}</span>
          <div :class="index > 0 ? 'tag-active' : ''">
            <SvgIcon class="tag-close" v-if="index > 0" name="del" @click.stop="tagClose(tag, index)" />
          </div>
        </div>
      </div>
    </div>
    <div class="arrow-right" v-show="isArrowShow">
      <SvgIcon name="arrow-right" @click="moveRight" />
    </div>
  </div>
</template>

<script setup>
import { useTagStore } from '@/stores/modules/tag'
import { useSettingStore } from '@/stores/modules/setting'
import { computed, nextTick, onMounted, onBeforeUnmount, ref, watch } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import config from '@/config'

const tagStore = useTagStore()
const settingsStore = useSettingStore()

const route = useRoute()
const router = useRouter()
const activeIndex = ref(0)
const tagList = computed(() => tagStore.tagList)

const tagsRef = ref(null)
const tagsScrollRef = ref(null)
const tagsItemRef = ref([])
const isArrowShow = ref(false)

const translateX = ref(0)
const tagsWidth = ref(0)
const tagScrollWidth = ref(0)

// 初始化标签和尺寸计算
const initTags = async () => {
  await nextTick()
  if (!tagsScrollRef.value) {
    return
  }
  tagsWidth.value = tagsScrollRef.value.offsetWidth
  tagScrollWidth.value = tagsScrollRef.value.scrollWidth
  isArrowShow.value = tagScrollWidth.value > tagsWidth.value
}

// 自动滚动到当前激活标签
const moveView = async index => {
  await nextTick()
  if (!tagsItemRef.value[index] || !tagsScrollRef.value) {
    return
  }

  const tagEl = tagsItemRef.value[index]
  const tagLeft = tagEl.offsetLeft
  const tagRight = tagLeft + tagEl.offsetWidth
  const currentScrollLeft = -translateX.value
  const currentScrollRight = currentScrollLeft + tagsWidth.value

  let newTranslate = translateX.value

  // 判断是否需要调整位置
  if (tagLeft < currentScrollLeft) {
    newTranslate = -tagLeft
  } else if (tagRight > currentScrollRight) {
    newTranslate = -(tagRight - tagsWidth.value)
  }

  // 限制滚动范围
  const maxTranslate = Math.min(0, tagsWidth.value - tagScrollWidth.value)
  translateX.value = Math.max(Math.min(newTranslate, 0), maxTranslate)
}

// 左右箭头点击处理
const moveLeft = () => {
  translateX.value = Math.min(translateX.value + tagsWidth.value, 0)
  checkBoundary()
}

const moveRight = () => {
  const maxTranslate = tagsWidth.value - tagScrollWidth.value
  translateX.value = Math.max(translateX.value - tagsWidth.value, maxTranslate)
  checkBoundary()
}

// 边界检测
const checkBoundary = () => {
  const maxTranslate = Math.min(0, tagsWidth.value - tagScrollWidth.value)
  translateX.value = Math.max(translateX.value, maxTranslate)
  translateX.value = Math.min(translateX.value, 0)
}

const pageResize = () => {
  if (document.body.clientWidth < 768) {
    settingsStore.isCollapsed = true
  } else {
    settingsStore.isCollapsed = false
  }
  initTags()
  checkBoundary()
  const index = tagList.value.findIndex(item => item.path === route.path)
  if (index > -1) {
    moveView(index)
  }
}

// 监听路由变化自动滚动
watch(
  () => route.path,
  newVal => {
    const index = tagList.value.findIndex(item => item.path === newVal)
    activeIndex.value = index
    if (index > -1) {
      moveView(index)
    }
  }
)

// 监听窗口大小变化
onMounted(() => {
  initTags()
  activeIndex.value = tagList.value.findIndex(item => item.path === route.path)
  window.addEventListener('resize', pageResize)
})

onBeforeUnmount(() => {
  window.removeEventListener('resize', pageResize)
})

// 标签点击处理
const tagClick = tag => {
  router.push(tag.path)
}

const tagClose = (tag, index) => {
  tagStore.delTag(tag)
  if (route.path !== tag.path) {
    return
  }
  router.push(tagList.value[index - 1].path)
}

// 监听标签列表变化
watch(
  () => tagList.value.length,
  () => {
    initTags()
    const index = tagList.value.findIndex(item => item.path === route.path)
    if (index > -1) {
      moveView(index)
    }
  }
)
</script>

<style lang="scss" scoped>
@use './index.scss' as *;
</style>
