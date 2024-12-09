/**
 * @description 用户api
 */

import http from '@/utils/http'
import { CONFIG } from '../config'

// 用户登录
export const loginIn = (data) => {
    return http.post(CONFIG.HTTP_BASEURL + '/login', data)
}