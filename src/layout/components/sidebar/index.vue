<template>
  <div class="sidebar">
    <custom-logo class="custom-logo" />
    <el-scrollbar class="menu-scrollbar">
      <el-menu router :default-active="route.path" :unique-opened="true" :collapse="settingStore.isCollapsed">
        <custom-menu :menu="menu" />
      </el-menu>
    </el-scrollbar>
  </div>
</template>

<script setup>
import { useSettingStore } from '@/stores/modules/setting'
import { useRoute } from 'vue-router'
import customLogo from './components/logo/index.vue'
import customMenu from './components/menu/index.vue'
import { ref } from 'vue'

const settingStore = useSettingStore()

const route = useRoute()

const menu = ref([
  { path: '/dashboard', icon: 'house', il18Name: 'tadHome', name: '首页', id: '01', children: [] },
  {
    path: '/system',
    icon: 'system',
    name: '系统管理',
    il18Name: 'tadSysManagement',
    id: '02',
    children: [
      {
        path: '/system/user',
        icon: 'user',
        name: '用户管理',
        il18Name: 'tadUserManage',
        id: '021',
        children: []
      },
      {
        path: '/system/ip',
        icon: 'visit',
        name: 'IP管理',
        il18Name: 'tadIpManage',
        id: '022',
        children: []
      }
    ]
  },
  {
    path: '/article',
    icon: 'article',
    name: '文章管理',
    il18Name: 'tadArticle',
    id: '03',
    children: [
      {
        path: '/article/index',
        icon: 'article',
        name: '文章管理',
        il18Name: 'tadArticle',
        id: '031',
        children: []
      },
      {
        path: '/article/tags',
        icon: 'tags',
        name: '标签管理',
        il18Name: 'tadTags',
        id: '032',
        children: []
      },
      {
        path: '/article/category',
        icon: 'category',
        name: '分类管理',
        il18Name: 'tadCategory',
        id: '033',
        children: []
      },
      {
        path: '/article/messages',
        icon: 'messages',
        name: '留言管理',
        il18Name: 'tadMessages',
        id: '034',
        children: []
      },
      {
        path: '/article/comments',
        icon: 'messages',
        name: '评论管理',
        il18Name: 'tadComments',
        id: '035',
        children: []
      }
    ]
  },
  {
    path: '/website',
    icon: 'system',
    name: '网站管理',
    il18Name: 'tadWebsiteManage',
    id: '04',
    children: [
      {
        path: '/website/basic',
        icon: 'system',
        name: '基础信息',
        il18Name: 'tadBasicInfo',
        id: '041',
        children: []
      }
    ]
  },
  {
    path: '/about/index',
    icon: 'about',
    name: '关于',
    il18Name: 'tadAbout',
    id: '07',
    children: []
  }
])
</script>

<style lang="scss" scoped>
@use './index.scss' as *;
</style>
