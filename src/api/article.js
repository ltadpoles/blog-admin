import http from '@/utils/http'

// 文章列表
export const page = data => {
  return http.post('/article/page', data)
}

// 新增文章
export const add = data => {
  return http.post('/article/add', data)
}

// 修改文章
export const update = data => {
  return http.post('/article/update', data)
}

// 详情
export const info = params => {
  return http.get('/article/info', { params })
}

// 删除
export const del = params => {
  return http.get('/article/del', { params })
}

// 置顶
export const top = params => {
  return http.get('/article/top', { params })
}

// 统计
export const stats = () => {
  return http.get('/article/stats')
}
