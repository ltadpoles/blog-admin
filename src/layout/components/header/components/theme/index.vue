<template>
  <div class="header-icon" @click="getThemeDrawer">
    <SvgIcon name="theme" />
  </div>
  <custom-drawer :isShow="drawerVisible" :title="$t('messages.themeConfiguration')" @close="drawerClose">
    <div class="cell">
      <div class="cell-title">{{ $t('messages.darkMode') }}</div>
      <el-switch
        v-model="settingStore.isDark"
        @click="darkClick($event)"
        inline-prompt
        :active-icon="Moon"
        :inactive-icon="Sunny"
      />
    </div>
    <div class="cell">
      <div class="cell-title">{{ $t('messages.themeColor') }}</div>
      <el-color-picker v-model="settingStore.primaryColor" :predefine="predefineColors" @change="colorChange" />
    </div>
    <div class="cell">
      <div class="cell-title">{{ $t('messages.greyMode') }}</div>
      <el-switch v-model="settingStore.isGrey" @change="greyChange" />
    </div>
  </custom-drawer>
</template>

<script setup>
import { ref } from 'vue'
import { useSettingStore } from '@/stores/modules/setting'
import customDrawer from '@/components/drawer/index.vue'
import { Sunny, Moon } from '@element-plus/icons-vue'

const settingStore = useSettingStore()

const drawerVisible = ref(false)

const predefineColors = ref(['#c71585', '#ff4500', '#ff8c00', '#90ee90', '#00ced1', '#409eff', '#1e90ff'])

const darkClick = e => {
  const transition = document.startViewTransition(() => {
    document.documentElement.classList.toggle('dark')
  })
  transition.ready.then(() => {
    const { clientX, clientY } = e
    const radius = Math.hypot(Math.max(clientX, innerWidth - clientX), Math.max(clientY, innerHeight - clientY))
    const clipPath = [`circle(0% at ${clientX}px ${clientY}px)`, `circle(${radius}px at ${clientX}px ${clientY}px)`]
    const isDark = document.documentElement.classList.contains('dark')
    document.documentElement.animate(
      {
        clipPath: !isDark ? clipPath.reverse() : clipPath
      },
      {
        duration: 500,
        pseudoElement: !isDark ? '::view-transition-old(root)' : '::view-transition-new(root)'
      }
    )
  })
}

const colorChange = color => {
  if (color) {
    settingStore.setPrimaryColor(color)
  } else {
    settingStore.setPrimaryColor('#409eff')
  }
}

const greyChange = val => {
  if (val) {
    settingStore.setGrey(true)
    document.documentElement.classList.add('grey')
  } else {
    settingStore.setGrey(false)
    document.documentElement.classList.remove('grey')
  }
}

const getThemeDrawer = () => {
  drawerVisible.value = true
}
const drawerClose = () => {
  drawerVisible.value = false
}
</script>

<style lang="scss" scoped>
@use './index.scss' as *;
</style>
