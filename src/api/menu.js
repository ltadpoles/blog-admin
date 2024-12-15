/**
 * @description 菜单api
 */

import http from '@/utils/http'
import { CONFIG } from '../config'

// 菜单list
export const list = (data) => {
  return http.post(CONFIG.HTTP_BASEURL + '/menu/list', data)
}

// 菜单新增
export const add = (data) => {
  return http.post(CONFIG.HTTP_BASEURL + '/menu/add', data)
}

// 获取菜单信息
export const info = (params) => {
  return http.get(CONFIG.HTTP_BASEURL + '/menu/info', { params })
}