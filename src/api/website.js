import http from '@/utils/http'

// 获取网站基础信息（公开接口）
export const getWebsiteInfo = () => {
  return http.get('/website/info')
}

// 获取网站基本信息（简化版，公开接口）
export const getWebsiteBasicInfo = () => {
  return http.get('/website/basic')
}

// 获取网站信息列表（管理用）
export const getWebsiteList = params => {
  return http.get('/website/list', { params })
}

// 更新网站基础信息
export const updateWebsiteInfo = data => {
  return http.post('/website/save', data)
}

// 删除网站信息记录
export const deleteWebsiteInfo = id => {
  return http.post(`/website/delete/${id}`)
}

// 切换维护模式
export const toggleMaintenance = data => {
  return http.post('/website/maintenance', data)
}

// 获取网站统计信息
export const getWebsiteStats = () => {
  return http.get('/website/stats')
}
