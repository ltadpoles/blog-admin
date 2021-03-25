import request from '@/utils/request'

export const login = params => {
    return request.post('/admin/login', params)
}

export const getUserInfo = () => {
    return request.get('/admin/info')
}

export const getUserMenu = () => {
    return request.get('/admin/menu')
}

// 获取省市
export const getCities = () => {
    return request.get('/v1/cities')
}