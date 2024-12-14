/**
 * @description 用户api
 */

import http from '@/utils/http'
import { CONFIG } from '../config'

// 用户list
export const list = (data) => {
  return http.post(CONFIG.HTTP_BASEURL + '/user/list', data)
}
