import request from '@/utils/request'

export const addTag = params => {
    return request.post('/v1/tag/add', params)
}

export const getTags = params => {
    return request.get('/v1/tag/list', params)
}

export const modifyTags = params => {
    return request.post('/v1/tag/modify', params)
}

export const delTags = id => {
    return request.get('/v1/tag/del', { id })
}
