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

/**
 * 获取用户访问趋势
 * @param {Object} params - 查询参数
 * @param {number} params.days - 统计天数（7或30）
 * @returns {Promise} 返回访问趋势数据
 */
export const getVisitTrend = (params = {}) => {
  return http.get('/visitTrend', { params })
}
