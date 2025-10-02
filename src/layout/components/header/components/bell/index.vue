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
        @click.stop="handleNotificationClick(item)"
      >
        <div class="notification-header">
          <el-tag :type="getTypeTag(item.type)" size="small">{{ getTypeText(item.type) }}</el-tag>
          <div class="notification-title-row">
            <span class="notification-title">{{ item.title }}</span>
            <span class="notification-time">{{ formatTime(item.createTime) }}</span>
          </div>
        </div>
        <div class="notification-content">{{ formatNotificationContent(item) }}</div>
      </div>
    </div>
    <el-divider />
    <div class="bell-footer">
      <span
        class="clear-bell"
        :class="{ 'is-disabled': notificationList.length === 0 }"
        @click="notificationList.length > 0 ? markAllAsRead() : null"
      >
        全部已读
      </span>
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
    // 如果是审核类型，先跳转到对应页面
    if (item.type === 'system') {
      await handleAuditNotification(item)
    }

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

// 处理审核通知跳转
const handleAuditNotification = async item => {
  const { sourceType } = item

  try {
    if (sourceType === 'comment') {
      // 跳转到评论管理页面
      router.push('/message/comments')
    } else if (sourceType === 'board') {
      // 跳转到留言管理页面
      router.push('/message/messages')
    } else {
      // 默认跳转到通知管理页面
      router.push('/message/notification')
    }
  } catch {
    // 忽略跳转错误
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
    like: 'warning',
    system: 'danger',
    audit: 'warning'
  }
  return typeMap[type] || 'info'
}

// 获取类型文本
const getTypeText = type => {
  const typeMap = {
    comment: '评论',
    board: '留言',
    like: '点赞',
    system: '系统',
    audit: '审核'
  }
  return typeMap[type] || '通知'
}

// 格式化通知内容
const formatNotificationContent = item => {
  const { type, content, title, fromUser, articleTitle, sourceType } = item

  const userName = fromUser?.name || '某用户'

  // 根据类型和来源类型组合判断
  if (type === 'like') {
    if (sourceType === 'article') {
      // 文章点赞：xx点赞了你的文章《xx》
      return `${userName}点赞了你的文章《${articleTitle || '未知文章'}》`
    } else if (sourceType === 'board') {
      // 留言点赞：xx点赞了你的留言xx
      return `${userName}点赞了你的留言${content && content !== '-' ? '：' + content : ''}`
    }
  }

  if (type === 'comment') {
    if (sourceType === 'article') {
      // 文章评论：xx评论了你的文章《xx》：xxx
      const commentContent = content && content !== '-' ? '：' + content : ''
      return `${userName}评论了你的文章《${articleTitle || '未知文章'}》${commentContent}`
    } else if (sourceType === 'board') {
      // 留言评论：xx给你留言：xxx
      return `${userName}给你留言评论：${content && content !== '-' ? content : '留言内容'}`
    }
  }

  if (type === 'board') {
    // 留言通知：xx给你留言：xxx
    return `${userName}给你留言：${content && content !== '-' ? content : '留言内容'}`
  }

  if (type === 'audit') {
    // 审核通知：根据来源类型显示不同内容
    if (sourceType === 'comment') {
      return '有新的评论需要审核'
    }
    if (sourceType === 'board') {
      return '有新的留言需要审核'
    }
    return '有新的内容需要审核'
  }

  if (type === 'system') {
    // 系统通知：显示标题
    return title || '系统通知'
  }

  // 默认情况：显示标题
  return title || '通知'
}

// 初始化
onMounted(() => {
  getUnreadCount()
})
</script>

<style lang="scss" scoped>
@use './index.scss' as *;
</style>
