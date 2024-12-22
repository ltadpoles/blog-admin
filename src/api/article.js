/**
 * @description 文章api
 */

import http from '@/utils/http'
import { CONFIG } from '../config'

// 文章list
export const list = (data) => {
  return http.post(CONFIG.HTTP_BASEURL + '/article/list', data)
}

// // 文章添加
// export const add = (data) => {
//   return http.post(CONFIG.HTTP_BASEURL + '/category/add', data)
// }

// // 文章更新
// export const update = (data) => {
//   return http.post(CONFIG.HTTP_BASEURL + '/category/update', data)
// }

// // 获取文章信息
// export const info = (params) => {
//   return http.get(CONFIG.HTTP_BASEURL + '/category/info', { params })
// }

// // 删除文章信息
// export const del = (params) => {
//   return http.get(CONFIG.HTTP_BASEURL + '/category/del', { params })
// }
