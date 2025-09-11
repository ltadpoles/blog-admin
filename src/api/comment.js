import http from '@/utils/http'

// 分页查询评论（顶级）
export const page = data => {
  return http.post('/comment/all-page', data)
}

// 子评论列表
export const children = params => {
  return http.get('/comment/list', { params })
}

// 删除评论（支持批量）
export const del = params => {
  return http.get('/comment/del', { params })
}

// 更新评论（状态/置顶等）
export const update = data => {
  return http.post('/comment/update', data)
}

// 详情（如需）
export const info = params => {
  return http.get('/comment/info', { params })
}

// 创建评论（回复评论）
export const create = data => {
  return http.post('/comment/add', data)
}
