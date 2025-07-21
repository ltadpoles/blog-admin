import http from '@/utils/http'

// 分类列表
export const page = data => {
  return http.post('/category/page', data)
}

// 新增分类
export const add = data => {
  return http.post('/category/add', data)
}

// 修改分类
export const update = data => {
  return http.post('/category/update', data)
}

// 不分页有效分类
export const categorylist = params => {
  return http.get('/category/list', { params })
}

// 详情
export const info = params => {
  return http.get('/category/info', { params })
}

// 删除
export const del = params => {
  return http.get('/category/del', { params })
}
