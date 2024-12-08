<template>
  <el-config-provider :locale="locale">
    <RouterView />
  </el-config-provider>
</template>

<script setup>
import { RouterView } from 'vue-router'
import { ElConfigProvider } from 'element-plus'
import { ref } from 'vue'

import zhCn from 'element-plus/dist/locale/zh-cn.mjs'

const locale = ref(zhCn)
</script>
