<template>
  <div class="error-page">
    <SvgIcon name="403" width="320px" height="320px" />
    <div class="error-message">
      <div>无权限，请联系系统管理员</div>
      <el-button class="error-message-btn" type="primary" @click="$router.replace('/')">返回首页</el-button>
    </div>
  </div>
</template>
