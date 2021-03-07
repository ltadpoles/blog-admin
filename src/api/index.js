import request from '@/utils/request'

export const getUsers = () => {
    return request.get('/users')
}
