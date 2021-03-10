import request from '@/utils/request'

export const login = params => {
    return request.post('/admin/login', params)
}

export const getUserInfo = () => {
    return request.get('/admin/info')
}
