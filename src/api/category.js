/**
 * @description 分类api
 */

import http from '@/utils/http'
import { CONFIG } from '../config'

// 分类list
export const list = (data) => {
  return http.post(CONFIG.HTTP_BASEURL + '/category/list', data)
}

// 分类添加
export const add = (data) => {
  return http.post(CONFIG.HTTP_BASEURL + '/category/add', data)
}

// 分类更新
export const update = (data) => {
  return http.post(CONFIG.HTTP_BASEURL + '/category/update', data)
}

// 获取分类信息
export const info = (params) => {
  return http.get(CONFIG.HTTP_BASEURL + '/category/info', { params })
}

// 删除分类信息
export const del = (params) => {
  return http.get(CONFIG.HTTP_BASEURL + '/category/del', { params })
}
