/*
    封装axios请求
*/
import axios from 'axios'
import { message } from 'ant-design-vue'
import router from '../router'

message.config({
    top: `30px`,
    duration: 3,
    maxCount: 1
})

const instance = axios.create({
    baseURL: '/',
    timeout: 3000
})

function baseRequest(options) {
    // console.log(options)
    const headers = options.headers || {}
    const token = localStorage.getItem('token')
    if (token) {
        headers['x-access-token'] = token
    }
    headers['Content-Type'] = 'application/json'
    options.headers = headers
    return instance(options)
        .then(res => {
            const data = res.data || {}

            if (res.status !== 200) {
                return Promise.reject({ message: '请求失败', res, data })
            }
            if (data.code !== 0) {
                message.warning(data.message)
                return Promise.reject({ message: data.message })
            }
            return Promise.resolve(data, res)
        })
        .catch(err => {
            // 超时
            if (err.request.readyState == 4 && err.request.status == 0) {
                //重新请求或者返回登录页
                router.push('/login')
                message.error('请求超时...')
                return Promise.reject({ message: '请求超时' })
            }
            switch (err.response.status) {
                case 403:
                    message.error('登录态失效，即将跳转到登录页...')
                    setTimeout(() => {
                        router.push('/login')
                    }, 2000)
                    return Promise.reject({ message: '请求失败' })
                default:
                    return Promise.reject({ message: '请求失败' })
            }
        })
}

/**
 * http 请求基础类
 * 参考文档 https://www.kancloud.cn/yunye/axios/234845
 *
 */
const request = ['post', 'put', 'patch'].reduce((request, method) => {
    /**
     *
     * @param url string 接口地址
     * @param data object get参数
     * @param options object axios 配置项
     * @returns {AxiosPromise}
     */
    request[method] = (url, data = {}, options = {}) => {
        return baseRequest(Object.assign({ url, data, method }, options))
    }
    return request
}, {})

;['get', 'delete', 'head'].forEach(method => {
    /**
     *
     * @param url string 接口地址
     * @param params object get参数
     * @param options object axios 配置项
     * @returns {AxiosPromise}
     */
    request[method] = (url, params = {}, options = {}) => {
        return baseRequest(Object.assign({ url, params, method }, options))
    }
})

export default request
