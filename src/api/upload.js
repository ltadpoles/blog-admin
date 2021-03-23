import request from '@/utils/request'

export const uploadImg = params => {
    return request.post('/v1/upImg', params)
}
