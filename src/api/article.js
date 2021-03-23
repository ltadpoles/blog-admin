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

export const modifyArticle = params => {
    return request.post('/v1/article/modify', params)
}

export const getArticleInfo = id => {
    return request.get('/v1/article/info', { id })
}
