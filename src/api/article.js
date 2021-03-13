import request from '@/utils/request'

export const getList = params => {
    return request.get('/v1/article/list', params)
}

export const delArticle = id => {
    return request.get('/v1/article/del', { id })
}

export const addArticle = params => {
    return request.post('/v1/article/add', params)
}
