<template>
    <div class="about">
        <a-form
            ref="formRef"
            :model="userData"
            :label-col="labelCol"
            :wrapper-col="wrapperCol"
            hideRequiredMark
        >
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
import { defineComponent, reactive, ref, toRaw, toRefs } from 'vue'
import { notification } from 'ant-design-vue'

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
            isModify: true // 编辑状态
        })
        const userData = reactive({
            name: '游荡de蝌蚪',
            sex: '1',
            address: ['Zhejiang', 'Hangzhou'],
            desc: '一个前端'
        })

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

        return {
            ...toRefs(state),
            formRef,
            userData,
            onSubmit,
            modify,
            resetForm,
            options
        }
    }
})
</script>

<style lang="less" scoped>
.about {
    position: relative;
    .record {
        position: absolute;
        top: 0;
        right: 10px;
    }
}
</style>
