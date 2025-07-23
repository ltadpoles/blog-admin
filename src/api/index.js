import http from '@/utils/http'

// 用户登录接口
export const upload = data => {
  return http.post('/file/upload', data)
}
