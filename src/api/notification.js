import http from '@/utils/http'

// 分页查询通知列表
export const page = data => {
  return http.post('/notification/page', data)
}

// 分页查询通知列表-管理员
export const adminPage = data => {
  return http.post('/notification/admin-page', data)
}

// 获取未读通知数量
export const unreadCount = () => {
  return http.get('/notification/unread-count')
}

// 标记通知为已读（支持批量）
export const markAsRead = data => {
  return http.post('/notification/mark-read', data)
}

// 标记所有通知为已读
export const markAllAsRead = data => {
  return http.post('/notification/mark-all-read', data)
}

// 删除通知（支持批量）
export const del = data => {
  return http.post('/notification/delete', data)
}

// 清空已读通知
export const clearRead = data => {
  return http.post('/notification/clear-read', data)
}

// 获取通知详情
export const info = params => {
  return http.get('/notification/info', { params })
}
