<template>
  <template v-for="item in menu" :key="item.path">
    <el-sub-menu :index="item.path" v-if="item.children && item.children.length > 0">
      <template #title>
        <el-icon :size="18" v-if="item.icon">
          <component :is="item.icon" />
        </el-icon>
        <span>{{ item.name }}</span>
      </template>
      <menu-tree :menu="item.children" />
    </el-sub-menu>

    <template v-else>
      <el-menu-item :index="item.path">
        <el-icon :size="18" v-if="item.icon">
          <component :is="item.icon" />
        </el-icon>
        <span>{{ item.name }}</span>
      </el-menu-item>
    </template>
  </template>
</template>

<script setup>
defineOptions({
  name: 'menuTree'
})
defineProps({
  menu: {
    type: Array,
    required: true,
    default: () => []
  }
})
</script>