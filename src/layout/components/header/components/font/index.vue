<template>
  <el-dropdown trigger="hover" @command="handleFontSizeChange">
    <div class="header-icon">
      <SvgIcon name="lang" />
    </div>
    <template #dropdown>
      <el-dropdown-menu>
        <el-dropdown-item
          v-for="size in fontSizeOptions"
          :key="size"
          :command="size"
          :style="getDropdownItemStyle(settingStore.fontSize, size)"
        >
          <el-icon class="check-icon">
            <Check v-if="settingStore.fontSize === size" />
          </el-icon>
          <span>{{ size }}px</span>
        </el-dropdown-item>
      </el-dropdown-menu>
    </template>
  </el-dropdown>
</template>

<script setup>
import { useCommon } from '@/hooks/useCommon'
import { useSettingStore } from '@/stores/modules/setting'

const { getDropdownItemStyle } = useCommon()

const fontSizeOptions = [13, 14, 15, 16]

const settingStore = useSettingStore()

const handleFontSizeChange = size => {
  if (fontSizeOptions.includes(size)) {
    settingStore.setFontSize(size)
  }
}
</script>
