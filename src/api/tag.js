/**
 * @description 标签api
 */

import http from '@/utils/http'
import { CONFIG } from '../config'

// 标签list
export const list = (data) => {
  return http.post(CONFIG.HTTP_BASEURL + '/tag/list', data)
}

// 标签添加
export const add = (data) => {
  return http.post(CONFIG.HTTP_BASEURL + '/tag/add', data)
}

// 标签更新
export const update = (data) => {
  return http.post(CONFIG.HTTP_BASEURL + '/tag/update', data)
}

// 获取标签信息
export const info = (params) => {
  return http.get(CONFIG.HTTP_BASEURL + '/tag/info', { params })
}

// 删除标签信息
export const del = (params) => {
  return http.get(CONFIG.HTTP_BASEURL + '/tag/del', { params })
}
