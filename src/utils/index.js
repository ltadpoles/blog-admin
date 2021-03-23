/**
 * 判断用户有没有修改、删除权限
 * @param {String 用户id}} userId
 * @returns
 */
export const getState = userId => {
    let info = JSON.parse(localStorage.getItem('info'))
    if (info && info.state === '0') {
        // 超级管理员
        return true
    } else {
        if (info && info.id == userId) {
            return true
        } else {
            return false
        }
    }
}

export const getUserId = () => {
    let info = JSON.parse(localStorage.getItem('info'))
    if (info && info.id) return info.id
}
