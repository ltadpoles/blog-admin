<template>
    <div class="about">
        <a-form
            ref="formRef"
            :model="userData"
            :label-col="labelCol"
            :wrapper-col="wrapperCol"
            hideRequiredMark
        >
            <a-form-item label="头像" name="avatar">
                <a-upload
                    accept=".png, .jpg, .jpeg"
                    list-type="picture-card"
                    :show-upload-list="false"
                    action="http://localhost:4000/v1/upImg"
                    :before-upload="beforeUpload"
                    @change="handleChange"
                    v-if="!isModify"
                >
                    <div>
                        <img
                            class="avatar"
                            v-if="userData.avatar"
                            :src="userData.avatar"
                            alt="avatar"
                        />
                    </div>
                </a-upload>
                <img
                    class="avatar"
                    v-if="userData.avatar && isModify"
                    :src="userData.avatar"
                    alt="avatar"
                />
            </a-form-item>
            <a-form-item label="昵称" name="name">
                <a-input
                    v-model:value="userData.name"
                    v-if="!isModify"
                    :maxlength="10"
                    placeholder="请输入昵称"
                />
                <span v-if="isModify">{{ userData.name }}</span>
            </a-form-item>

            <a-form-item label="性别" name="sex">
                <a-radio-group v-model:value="userData.sex" v-if="!isModify">
                    <a-radio value="1">男</a-radio>
                    <a-radio value="0">女</a-radio>
                </a-radio-group>
                <span v-if="isModify">{{ userData.sex === '1' ? '男' : '女' }}</span>
            </a-form-item>

            <a-form-item label="地区" name="address">
                <a-cascader
                    v-model:value="userData.address"
                    v-if="!isModify"
                    :options="options"
                    placeholder="选择地区"
                >
                </a-cascader>
                <span v-if="isModify">{{ userData.address }}</span>
            </a-form-item>

            <a-form-item label="个人简介" name="desc">
                <a-textarea
                    v-model:value="userData.desc"
                    v-if="!isModify"
                    :maxlength="50"
                    placeholder="请输入个人简介(50字以内)"
                />
                <span v-if="isModify">{{ userData.desc }}</span>
            </a-form-item>
        </a-form>

        <div class="record">
            <a-button type="link" v-if="isModify" @click="modify">编辑</a-button>
            <div v-if="!isModify">
                <a-button type="link" @click="resetForm">取消</a-button>
                <a-button type="link" @click="onSubmit">保存</a-button>
            </div>
        </div>
    </div>
</template>

<script>
import { defineComponent, onMounted, reactive, ref, toRaw, toRefs } from 'vue'
import { notification } from 'ant-design-vue'
import { UploadOutlined } from '@ant-design/icons-vue'
import { message } from 'ant-design-vue'
import { getCities } from '@/api'

const options = [
    {
        value: 'Zhejiang',
        label: '浙江',
        children: [
            {
                value: 'Hangzhou',
                label: '杭州'
            }
        ]
    },
    {
        value: 'Jiangsu',
        label: '江苏',
        children: [
            {
                value: 'Nanjing',
                label: '南京'
            }
        ]
    }
]

export default defineComponent({
    setup() {
        const formRef = ref()
        const state = reactive({
            labelCol: {
                span: 4
            },
            wrapperCol: {
                span: 10
            },
            isModify: true, // 编辑状态
            loading: false
        })
        const userData = reactive({
            avatar: 'http://localhost:4000/upload/1616680917385flag.png',
            name: '游荡de蝌蚪',
            sex: '1',
            address: ['Zhejiang', 'Hangzhou'],
            desc: '一个前端'
        })

        const beforeUpload = file => {
            return new Promise((resolve, reject) => {
                const reader = new FileReader()
                reader.readAsDataURL(file) //base64编码
                reader.onload = function(e) {
                    const img = new Image()
                    img.src = e.target.result //获取编码后的值,也可以用this.result获取
                    img.onload = async function() {
                        const isScale =
                            this.height / this.width < 1.2 && this.height / this.width > 0.8
                        if (!isScale) {
                            message.warning('图片比例不支持')
                            reject('图片比例不支持')
                        }

                        const isJpgOrPng = file.type === 'image/jpeg' || file.type === 'image/png'
                        if (!isJpgOrPng) {
                            message.warning('所选文件格式不支持')
                            reject('所选文件格式不支持')
                        }
                        const isLt1M = file.size / 1024 / 1024 < 1
                        if (!isLt1M) {
                            message.warning(`最大支持1MB文件`)
                            reject(`最大支持1MB文件`)
                        }
                        resolve(isScale && isJpgOrPng && isLt1M)
                    }
                }
            })
        }

        const handleChange = info => {
            if (info.file.status === 'uploading') {
                state.loading = true
                return
            }

            if (info.file.status === 'done') {
                message.success('上传成功')
                userData.avatar = info.file.response.url
            }

            if (info.file.status === 'warning') {
                state.loading = false
                message.warning('上传失败')
            }
        }

        const onSubmit = () => {
            state.isModify = true
            formRef.value
                .validate()
                .then(() => {
                    console.log('values', userData, toRaw(userData))
                })
                .catch(error => {
                    console.log('error', error)
                })

            notification['success']({
                message: '提示',
                description: '信息更新成功！'
            })
        }

        const resetForm = () => {
            state.isModify = true
        }

        const modify = () => {
            state.isModify = false
        }

        onMounted(() => {
            getCities()
        })

        return {
            ...toRefs(state),
            formRef,
            userData,
            beforeUpload,
            handleChange,
            onSubmit,
            modify,
            resetForm,
            options
        }
    },
    components: {
        UploadOutlined
    }
})
</script>

<style lang="less" scoped>
.about {
    position: relative;
    .avatar {
        width: 80px;
        height: 80px;
    }
    .record {
        position: absolute;
        top: 0;
        right: 10px;
    }
}
</style>
