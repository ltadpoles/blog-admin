import request from '@/utils/request'

export const addTag = params => {
    return request.post('/v1/tag/add', params)
}

export const getTags = params => {
    return request.get('/v1/tag/list', params)
}
