import http from '@/utils/http'

// IP列表查询
export const getIPList = data => {
  return http.post('/ip/list', data)
}

// IP统计信息
export const getIPStats = () => {
  return http.get('/ip/stats')
}

// 限制单个IP
export const blockIP = data => {
  return http.post('/ip/block', data)
}

// 解除IP限制
export const unblockIP = data => {
  return http.post('/ip/unblock', data)
}

// 批量限制IP
export const batchBlockIP = data => {
  return http.post('/ip/batch-block', data)
}

// 批量解除IP限制
export const batchUnblockIP = data => {
  return http.post('/ip/batch-unblock', data)
}

// 删除IP记录
export const deleteIP = params => {
  return http.get('/ip/delete', { params })
}
