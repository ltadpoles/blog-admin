<template>
  <template v-for="item in menu" :key="item.path">
    <el-sub-menu :index="item.path" v-if="item.children && item.children.length > 0">
      <template #title>
        <SvgIcon
          :name="item.icon"
          :marginRight="!settingStore.isCollapsed ? '3px' : '0px'"
          :width="!settingStore.isCollapsed ? '1rem' : '1.5rem'"
          :height="!settingStore.isCollapsed ? '1rem' : '1.5rem'"
        />
        <span>{{ $t(`messages.${item.il18Name}`) }}</span>
      </template>
      <menu-tree :menu="item.children" />
    </el-sub-menu>

    <template v-else>
      <el-menu-item :index="item.path">
        <SvgIcon
          :name="item.icon"
          :marginRight="!settingStore.isCollapsed ? '3px' : '0px'"
          :width="!settingStore.isCollapsed ? '1rem' : '1.5rem'"
          :height="!settingStore.isCollapsed ? '1rem' : '1.5rem'"
        />
        <span>{{ $t(`messages.${item.il18Name}`) }}</span>
      </el-menu-item>
    </template>
  </template>
</template>

<script setup>
import { useSettingStore } from '@/stores/modules/setting'

const settingStore = useSettingStore()

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
