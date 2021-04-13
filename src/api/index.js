import request from '@/utils/request'

export const login = params => {
    return request.post('/admin/login', params)
}

export const getUserInfo = () => {
    return request.get('/admin/info')
}

export const userUpdata = params => {
    return request.post('/admin/updata', params)
}

export const getUserMenu = () => {
    return request.get('/admin/menu')
}

export const getCities = () => {
    return request.get('/v1/cities')
}
