<template>
  <el-dropdown>
    <div class="el-dropdown-link">
      <img class="avatar-img" alt="avatar" :src="getImageUrl('avatar.jpg')" />
      <span>游荡de蝌蚪</span>
    </div>
    <template #dropdown>
      <el-dropdown-menu>
        <el-dropdown-item @click="getAbout">
          <el-icon>
            <User />
          </el-icon>
          <span>{{ $t('messages.personalCenter') }}</span>
        </el-dropdown-item>
        <el-dropdown-item divided @click="logout">
          <el-icon>
            <SwitchButton />
          </el-icon>
          <span>{{ $t('messages.logout') }}</span>
        </el-dropdown-item>
      </el-dropdown-menu>
    </template>
  </el-dropdown>
</template>

<script setup>
import { getImageUrl } from '@/utils'
import { useRouter } from 'vue-router'
import { RESETSTORE } from '@/stores/reset'

const router = useRouter()

const getAbout = () => {
  router.push('/about/index')
}

const logout = () => {
  RESETSTORE()
  router.replace('/login')
}
</script>

<style lang="scss" scoped>
@use './index.scss' as *;
</style>
