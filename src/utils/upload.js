import { message } from 'ant-design-vue'

const format = {
    scale: 0.7,
    type: 'image/jpeg,image/png',
    size: 1
}

/**
 * 文件上传限制
 * @param {file, 上传的文件} file
 * @param {Object, 限制条件} condition
 * @returns
 */
export const imgCondition = (file, condition = format) => {
    return new Promise((resolve, reject) => {
        const reader = new FileReader()
        reader.readAsDataURL(file) //base64编码
        reader.onload = async function(e) {
            const img = new Image()
            img.src = e.target.result //获取编码后的值,也可以用this.result获取
            img.onload = function() {
                console.log('height:' + this.height + '----width:' + this.width)
                const scale = this.height / this.width < condition.scale
                if (!scale) {
                    message.warning('图片比例不支持')
                    reject('图片比例不支持')
                }
                const isJpgOrPng = condition.type.split(',').some(item => item === file.type)
                if (!isJpgOrPng) {
                    message.warning('所选文件格式不支持')
                    reject('所选文件格式不支持')
                }
                const isLt1M = file.size / 1024 / 1024 < condition.size
                if (!isLt1M) {
                    message.warning(`最大支持${condition.size}MB文件`)
                    reject(`最大支持${condition.size}MB文件`)
                }
                resolve(scale && isJpgOrPng && isLt1M)
            }
        }
    })
}
