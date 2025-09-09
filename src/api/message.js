import http from '@/utils/http'

// 分页查询留言
export const page = data => {
  return http.post('/board/page', data)
}

// 删除留言（支持批量，后端按 ids 逗号分隔或数组均可）
export const del = params => {
  return http.get('/board/delete', { params })
}

// 单条详情（如后续需要查看）
export const info = params => {
  return http.get('/board/info', { params })
}

// 修改留言状态（置顶/私密/是否可回复）
export const update = data => {
  return http.post('/board/update', data)
}

// 按父留言ID查询子留言
export const children = params => {
  return http.get('/board/list', { params })
}
