import axios from 'axios'
import { refresh } from './refresh-token'
import { useUserStore } from '@/stores/modules/user'
import config from '@/config'
import { ElMessage } from 'element-plus'

const http = axios.create({
  timeout: 3000,
  baseURL: import.meta.env.VITE_HTTP_BASEURL
})

// 添加请求拦截器
http.interceptors.request.use(
  function (config) {
    // 在发送请求之前做些什么
    const userStore = useUserStore()
    const token = userStore.token.access_token

    // 添加 header 请求头
    if (token) {
      config.headers.Authorization = token
    }

    return config
  },
  function (error) {
    // 对请求错误做些什么
    return Promise.reject(error)
  }
)

// 添加响应拦截器
http.interceptors.response.use(
  function (response) {
    // 2xx 范围内的状态码都会触发该函数。
    // 对响应数据做点什么
    if (response.data.code === '500' || response.data.code === '403') {
      ElMessage({
        message: response.data.msg,
        type: 'error'
      })
      return Promise.reject(response.data.msg)
    }
    return response
  },
  function (error) {
    // 超出 2xx 范围的状态码都会触发该函数。
    // 对响应错误做点什么
    try {
      switch (error.response.status) {
        case 400:
          ElMessage({
            message: error.response.data.msg || '请求错误',
            type: 'error'
          })
          break
        case 401:
          if (config.ISREFRESHTOKEN) {
            refresh(http, error.response.config)
          } else {
            ElMessage({
              message: '登录已过期，请重新登录',
              type: 'error'
            })
          }
          break
        case 403:
          ElMessage({
            message: '您没有相关权限',
            type: 'error'
          })
          break
        case 404:
          ElMessage({
            message: '请求链接不存在',
            type: 'error'
          })
          break
        case 500:
          ElMessage({
            message: '服务器错误，请稍后再试',
            type: 'error'
          })
          break
        default:
          ElMessage({
            message: '系统异常，请稍后再试',
            type: 'error'
          })
      }
    } catch (error) {
      return Promise.reject(error)
    }
  }
)

export default http
