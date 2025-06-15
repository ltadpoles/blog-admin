<template>
  <el-config-provider :locale="locale">
    <RouterView />
  </el-config-provider>
</template>

<script setup>
import { RouterView } from 'vue-router'
import { ElConfigProvider } from 'element-plus'
import { computed } from 'vue'
import zhCN from 'element-plus/dist/locale/zh-cn'
import en from 'element-plus/dist/locale/en'
import { useSettingStore } from './stores/modules/setting'

const settingStore = useSettingStore()
let locale = computed(() => {
  return settingStore.lang === 'zhCN' ? zhCN : en
})
</script>
