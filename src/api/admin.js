import http from '@/utils/http'

// 用户登录接口
export const login = data => {
  return http.post('/login', data)
}

// 获取用户信息
export const getUserInfo = () => {
  return http.get('/getUserInfo')
}
