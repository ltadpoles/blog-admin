<template>
  <el-scrollbar class="content-views" wrap-class="wrap-sty">
    <router-view v-slot="{ Component }">
      <transition name="slide-fade">
        <component :is="Component" />
      </transition>
    </router-view>
  </el-scrollbar>
</template>

<script setup>
</script>

<style lang="less" scoped></style>