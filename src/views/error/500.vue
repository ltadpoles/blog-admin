<template>
  <div class="error-page">
    <SvgIcon name="500" width="320px" height="320px" />
    <div class="error-message">
      <div>服务器错误，请稍后再试</div>
      <el-button class="error-message-btn" type="primary" @click="$router.replace('/')">返回首页</el-button>
    </div>
  </div>
</template>
