<template>
  <el-popover trigger="click" :width="380" @show="getNotifications">
    <template #reference>
      <el-badge :value="unreadCount" :max="99" :offset="[-12, 17]" :hidden="unreadCount === 0">
        <div class="header-icon">
          <SvgIcon name="message" />
        </div>
      </el-badge>
    </template>
    <div class="bell-title">{{ $t('messages.notify') }}</div>
    <div class="bell-content" v-loading="loading">
      <div v-if="notificationList.length === 0" class="bell-content-empty">暂无通知</div>
      <div
        v-else
        v-for="item in notificationList"
        :key="item.id"
        class="bell-content-item is-unread"
        @click="handleNotificationClick(item)"
      >
        <div class="notification-header">
          <el-tag :type="getTypeTag(item.type)" size="small">{{ getTypeText(item.type) }}</el-tag>
          <div class="notification-title-row">
            <span class="notification-title">{{ item.title }}</span>
            <span class="notification-time">{{ formatTime(item.createTime) }}</span>
          </div>
        </div>
        <div class="notification-content">{{ item.content }}</div>
      </div>
    </div>
    <el-divider />
    <div class="bell-footer">
      <span class="clear-bell" @click="markAllAsRead">全部已读</span>
      <span class="view-more" @click="viewMore">查看更多</span>
    </div>
  </el-popover>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import { ElMessage } from 'element-plus'
import { useRouter } from 'vue-router'
import { dayjs } from 'element-plus'
import * as notificationApi from '@/api/notification'

const router = useRouter()
const loading = ref(false)
const notificationList = ref([])
const unreadCount = ref(0)

// 获取通知列表（只获取未读通知）
const getNotifications = async () => {
  try {
    loading.value = true
    // 使用普通用户的page接口
    const { data } = await notificationApi.page({
      isRead: '0' // 未读状态
    })
    const payload = data?.data || data
    notificationList.value = payload?.records || payload?.list || []
    // 更新未读数量为实际列表长度
    unreadCount.value = notificationList.value.length
  } finally {
    loading.value = false
  }
}

// 获取未读数量
const getUnreadCount = async () => {
  try {
    const { data } = await notificationApi.unreadCount()
    // 兼容多种返回格式
    let count = 0
    if (typeof data?.data === 'number') {
      count = data.data
    } else if (typeof data?.data?.count === 'number') {
      count = data.data.count
    } else if (typeof data === 'number') {
      count = data
    }
    unreadCount.value = count
  } catch {
    unreadCount.value = 0
  }
}

// 点击通知项
const handleNotificationClick = async item => {
  try {
    await notificationApi.markAsRead({ ids: [item.id] })
    // 从列表中移除该通知
    const index = notificationList.value.findIndex(n => n.id === item.id)
    if (index > -1) {
      notificationList.value.splice(index, 1)
      // 更新未读数量
      unreadCount.value = notificationList.value.length
    }
  } catch {
    // 忽略错误
  }
}

// 全部标记已读
const markAllAsRead = async () => {
  if (notificationList.value.length === 0) {
    return
  }

  try {
    // 收集当前列表中所有通知的ID
    const ids = notificationList.value.map(item => item.id)
    // 调用markAsRead接口
    await notificationApi.markAsRead({ ids })
    ElMessage.success('已全部标记为已读')
    // 清空列表（因为只显示未读通知）
    notificationList.value = []
    // 清空未读数量
    unreadCount.value = 0
  } catch {
    // 忽略错误
  }
}

// 查看更多
const viewMore = () => {
  router.push('/message/notification')
}

// 格式化时间
const formatTime = time => {
  const now = dayjs()
  const target = dayjs(time)
  const diff = now.diff(target, 'minute')

  if (diff < 1) {
    return '刚刚'
  }
  if (diff < 60) {
    return `${diff}分钟前`
  }
  if (diff < 60 * 24) {
    return `${Math.floor(diff / 60)}小时前`
  }
  if (diff < 60 * 24 * 2) {
    return '昨天'
  }
  return target.format('MM-DD HH:mm')
}

// 获取类型标签
const getTypeTag = type => {
  const typeMap = {
    comment: 'primary',
    board: 'success',
    reply: 'info',
    like: 'warning',
    system: 'danger'
  }
  return typeMap[type] || 'info'
}

// 获取类型文本
const getTypeText = type => {
  const typeMap = {
    comment: '评论',
    board: '留言',
    reply: '回复',
    like: '点赞',
    system: '系统'
  }
  return typeMap[type] || '通知'
}

// 初始化
onMounted(() => {
  getUnreadCount()
})
</script>

<style lang="scss" scoped>
@use './index.scss' as *;
</style>
