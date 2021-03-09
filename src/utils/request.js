/*
    封装axios请求
*/
import axios from 'axios'
import { message } from 'ant-design-vue'

const instance = axios.create({
    baseURL: '/',
    timeout: 3000
})

function baseRequest(options) {
    // console.log(options)
    const headers = options.headers || {}
    const token = localStorage.getItem('token')
    if (token) {
        headers['Authorization'] = token
    }
    headers['Content-Type'] = 'application/json'
    options.headers = headers
    return instance(options).then(res => {
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
