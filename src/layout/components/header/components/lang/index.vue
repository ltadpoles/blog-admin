<template>
  <el-dropdown trigger="hover" @command="langCommmand">
    <div class="header-icon">
      <SvgIcon name="language" />
    </div>
    <template #dropdown>
      <el-dropdown-menu>
        <el-dropdown-item command="zhCN" :style="getDropdownItemStyle(locale, 'zhCN')">
          <el-icon>
            <Check v-show="settingStore.lang === 'zhCN'" />
          </el-icon>
          中文简体</el-dropdown-item
        >
        <el-dropdown-item command="en" :style="getDropdownItemStyle(locale, 'en')">
          <el-icon> <Check v-show="settingStore.lang === 'en'" /> </el-icon>English</el-dropdown-item
        >
      </el-dropdown-menu>
    </template>
  </el-dropdown>
</template>

<script setup>
import { useSettingStore } from '@/stores/modules/setting'
import { useI18n } from 'vue-i18n'
import { useCommon } from '@/hooks/useCommon'

const { getDropdownItemStyle } = useCommon()

const { locale } = useI18n()

const settingStore = useSettingStore()

const langCommmand = lang => {
  settingStore.setLocale(lang)
  locale.value = lang
}
</script>
