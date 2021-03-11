import request from '@/utils/request'

export const getList = params => {
    return request.get('/v1/article/list', params)
}
