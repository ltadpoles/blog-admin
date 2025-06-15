<template>
  <div class="logo">
    <SvgIcon name="logo" width="2.1rem" height="2.1rem" marginRight="5px" />
    <h1 v-show="!settingStore.isCollapsed">
      {{ $t('messages.title') }}
    </h1>
  </div>
</template>

<script setup>
import { useSettingStore } from '@/stores/modules/setting'

const settingStore = useSettingStore()
</script>

<style lang="scss" scoped>
@use './index.scss' as *;
</style>
