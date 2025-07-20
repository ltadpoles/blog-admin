import http from '@/utils/http'

// 标签列表
export const page = data => {
  return http.post('/tag/page', data)
}

// 新增标签
export const add = data => {
  return http.post('/tag/add', data)
}

// 修改标签
export const update = data => {
  return http.post('/tag/update', data)
}

// 不分页有效标签
export const list = () => {
  return http.get('/tag/list')
}

// 详情
export const info = params => {
  return http.get('/tag/info', { params })
}

// 删除
export const del = params => {
  return http.get('/tag/del', { params })
}
