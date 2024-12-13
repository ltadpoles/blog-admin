<template>
  <div class="header">
    <div class="header-left">
      <el-icon :size="20" class="cursor-icon" @click="flodClick">
        <!-- eslint-disable vue/require-component-is -->
        <component :is="settingStore.isCollapsed ? 'Expand' : 'Fold'" />
      </el-icon>

      <el-breadcrumb :separator-icon="ArrowRight">
        <template v-for="item in route?.matched" :key="item">
          <el-breadcrumb-item v-if="item.meta?.title">{{ item.meta?.title }}</el-breadcrumb-item>
        </template>
      </el-breadcrumb>
    </div>
    <div class="header-right">
      <el-dropdown trigger="click" @command="handleMenuClick">
        <span class="header-right-user cursor-icon">
          <img src="@/assets/images/avatar.png" alt="" />
          {{ userStore.userInfo.username }}
        </span>
        <template #dropdown>
          <el-dropdown-menu>
            <el-dropdown-item command="/dashboard">
              <el-icon>
                <User />
              </el-icon>
              <span>个人中心</span>
            </el-dropdown-item>
            <el-dropdown-item @click="setting">
              <el-icon>
                <Setting />
              </el-icon>
              <span>设置</span>
            </el-dropdown-item>
            <el-dropdown-item>
              <el-icon>
                <Key />
              </el-icon>
              <span>修改密码</span>
            </el-dropdown-item>
            <el-dropdown-item divided command="/login" @click="logout">
              <el-icon>
                <SwitchButton />
              </el-icon>
              <span>退出登录</span>
            </el-dropdown-item>
          </el-dropdown-menu>
        </template>
      </el-dropdown>
    </div>
    <el-drawer v-model="themeConfig.drawer" :with-header="false" :destroy-on-close="true">
      <el-divider>全局主题</el-divider>
      <div class="drawer-item">
        <span class="demonstration">暗黑模式：</span>
        <el-switch v-model="themeConfig.theme" @change="themeChange" />
      </div>
      <div class="drawer-item">
        <span class="demonstration">主题色设置：</span>
        <el-color-picker v-model="themeConfig.primaryColor" @change="colorChange" />
      </div>
      <div class="drawer-item">
        <span class="demonstration">灰色模式：</span>
        <el-switch v-model="themeConfig.gray" @change="grayChange" />
      </div>
    </el-drawer>
  </div>
</template>

<script setup>
import { ArrowRight } from '@element-plus/icons-vue'
import { useSettingStore } from '@/stores/modules/setting'
import { useRoute, useRouter } from 'vue-router'
import { ElMessage } from 'element-plus'
import { RESETSTORE } from '@/stores/reset'
import { reactive } from 'vue'
import { useUserStore } from '@/stores/modules/user'

const settingStore = useSettingStore()
const userStore = useUserStore()

const route = useRoute()

const themeConfig = reactive({
  drawer: false,
  theme: false, // 暗黑模式
  primaryColor: '', // 主题色
  gray: false // 灰色模式
})
const flodClick = () => {
  settingStore.increment()
}

const router = useRouter()
const handleMenuClick = command => {
  router.push(command)
}

const setting = () => {
  themeConfig.primaryColor = settingStore.primaryColor
  themeConfig.drawer = true
}

const themeChange = val => {
  if (val) {
    document.documentElement.classList.add('dark')
  } else {
    document.documentElement.classList.remove('dark')
  }
}
const colorChange = color => {
  if (color) {
    settingStore.setPrimaryColor(color)
  } else {
    settingStore.setPrimaryColor('#409eff')
  }
}
const grayChange = val => {
  if (val) {
    document.documentElement.classList.add('gray')
  } else {
    document.documentElement.classList.remove('gray')
  }
}

const logout = () => {
  ElMessage({
    message: '退出登录',
    type: 'success',
  })
  // 清空 pinia 存储
  RESETSTORE()
  router.replace('/login')
}
</script>

<style lang="less" scoped>
.header {
  height: 60px;
  border-bottom: 1px solid var(--el-bg-color-page);
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 0 10px;
  background-color: var(--el-bg-color);

  .header-left {
    display: flex;
    align-items: center;
  }

  .header-right {
    display: flex;
    align-items: center;
    width: 110px;
    min-width: 110px;

    .header-right-theme {
      margin-right: 10px;
    }

    .header-right-user {
      display: flex;
      align-items: center;

      >img {
        width: 28px;
        margin-right: 5px;
      }
    }
  }
}

.cursor-icon {
  cursor: pointer;
  margin-right: 20px;
}

.drawer-item {
  display: flex;
  justify-content: space-between;
  margin-bottom: 10px;
}
</style>