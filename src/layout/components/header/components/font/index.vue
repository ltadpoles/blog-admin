<template>
  <el-dropdown trigger="hover" @command="fontCommmand">
    <div class="header-icon">
      <SvgIcon name="lang" />
    </div>
    <template #dropdown>
      <el-dropdown-menu>
        <el-dropdown-item :command="13" :style="getDropdownItemStyle(fontSize, 13)">
          <el-icon>
            <Check v-show="settingStore.fontSize === 13" />
          </el-icon>
          13px
        </el-dropdown-item>
        <el-dropdown-item :command="14" :style="getDropdownItemStyle(fontSize, 14)">
          <el-icon>
            <Check v-show="settingStore.fontSize === 14" />
          </el-icon>
          14px
        </el-dropdown-item>
        <el-dropdown-item :command="15" :style="getDropdownItemStyle(fontSize, 15)">
          <el-icon>
            <Check v-show="settingStore.fontSize === 15" />
          </el-icon>
          15px
        </el-dropdown-item>
        <el-dropdown-item :command="16" :style="getDropdownItemStyle(fontSize, 16)">
          <el-icon>
            <Check v-show="settingStore.fontSize === 16" />
          </el-icon>
          16px
        </el-dropdown-item>
      </el-dropdown-menu>
    </template>
  </el-dropdown>
</template>

<script setup>
import { useCommon } from '@/hooks/useCommon'
import { useSettingStore } from '@/stores/modules/setting'
import { computed } from 'vue'

const { getDropdownItemStyle } = useCommon()

const settingStore = useSettingStore()

const fontSize = computed(() => {
  return settingStore.fontSize
})

const fontCommmand = size => {
  settingStore.setFontSize(size)
}
</script>
