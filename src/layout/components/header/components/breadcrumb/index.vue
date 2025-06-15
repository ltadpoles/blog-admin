<template>
  <el-breadcrumb>
    <transition-group name="breadcrumb">
      <el-breadcrumb-item v-for="item in breadCrumbList" :key="item.path">
        <template #default>
          <div class="breadcrumb">
            <SvgIcon v-if="config.ISBREADCRUMBICON" :name="item?.meta?.icon" marginRight="3px" cursor="default" />
            <span>{{ $t(`messages.${item?.meta?.i18nName}`) }}</span>
          </div>
        </template>
      </el-breadcrumb-item>
    </transition-group>
  </el-breadcrumb>
</template>

<script setup>
import { watch, ref } from 'vue'
import { useRoute } from 'vue-router'
import config from '@/config'

const route = useRoute()

const breadCrumbList = ref([])

watch(
  () => route.path,
  () => {
    let arr = JSON.parse(JSON.stringify(route.matched))
    let index = arr.findIndex(item => !item.meta.title)

    if (index > -1) {
      arr.splice(index, 1)
    }
    breadCrumbList.value = arr
  },
  { immediate: true, deep: true }
)
</script>

<style lang="scss" scoped>
@use './index.scss' as *;
</style>
