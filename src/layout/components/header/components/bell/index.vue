<template>
  <el-popover trigger="hover" :width="320">
    <template #reference>
      <el-badge :value="3" :max="9" :offset="[-12, 17]">
        <div class="header-icon">
          <SvgIcon name="message" />
        </div>
      </el-badge>
    </template>
    <el-tabs v-model="activeName">
      <el-tab-pane :label="$t('messages.notify')" name="notify">
        <div class="bell-content">
          <div class="bell-content-item">通知内容</div>
        </div>
      </el-tab-pane>
      <el-tab-pane :label="$t('messages.todo')" name="todo">
        <div class="bell-content">
          <div class="bell-content-item">待办内容</div>
        </div>
      </el-tab-pane>
    </el-tabs>
    <el-divider />
    <div class="clear-bell" @click="clearBell">{{ $t('messages.clear') }}</div>
  </el-popover>
</template>

<script setup>
import { ref } from 'vue'
import { ElMessage } from 'element-plus'

const activeName = ref('notify')
const clearBell = () => {
  ElMessage.success('清除消息成功')
}
</script>

<style lang="scss" scoped>
@use './index.scss' as *;
</style>
