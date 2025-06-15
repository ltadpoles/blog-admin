<template>
  <div class="error-page">
    <SvgIcon name="404" width="320px" height="320px" />
    <div class="error-message">
      <div>页面不存在，请检查地址是否正确</div>
      <el-button class="error-message-btn" type="primary" @click="$router.replace('/')">返回首页</el-button>
    </div>
  </div>
</template>
