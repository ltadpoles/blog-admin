import http from '@/utils/http'

// 用户登录接口
export const upload = data => {
  return http.post('/file/upload', data)
}

/**
 * 获取网站信息
 * @returns {Promise} 返回网站信息
 */
export const websiteInfo = () => {
  return http.get('/website/info')
}
