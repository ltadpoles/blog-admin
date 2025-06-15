import http from '@/utils/http'

// 刷新token接口
export const refreshToken = data => {
  return http.post('/refreshToken', data)
}
