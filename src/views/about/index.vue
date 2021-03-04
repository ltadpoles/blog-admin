<template>
    <div>
        <a-form
            ref="formRef"
            :model="userData"
            :rules="rules"
            :label-col="labelCol"
            :wrapper-col="wrapperCol"
        >
            <a-form-item label="昵称" name="name">
                <a-input v-model:value="userData.name" />
            </a-form-item>
            <a-form-item label="头像" name="avatar">
                <a-input v-model:value="userData.avatar" />
            </a-form-item>
            <a-form-item label="性别" name="sex">
                <a-radio-group v-model:value="userData.sex">
                    <a-radio value="1">男</a-radio>
                    <a-radio value="0">女</a-radio>
                </a-radio-group>
            </a-form-item>
            <a-form-item label="手机号" name="phone">
                <a-input v-model:value="userData.phone" />
            </a-form-item>
            <a-form-item label="邮箱" name="email">
                <a-input v-model:value="userData.email" />
            </a-form-item>
            <a-form-item label="是否隐藏" name="hide">
                <a-switch v-model:checked="userData.hide" />
            </a-form-item>
            <a-form-item label="个人简介" name="desc">
                <a-textarea v-model:value="userData.desc" />
            </a-form-item>
            <a-form-item :wrapper-col="{ span: 14, offset: 4 }">
                <a-button type="primary" @click="onSubmit">保存</a-button>
                <a-button style="margin-left: 10px" @click="resetForm">取消</a-button>
            </a-form-item>
        </a-form>
    </div>
</template>

<script>
import { defineComponent, reactive, ref, toRaw } from 'vue'

export default defineComponent({
    setup() {
        const formRef = ref()
        const userData = reactive({
            name: '',
            avatar: '',
            sex: '',
            phone: '',
            email: '',
            hide: false,
            desc: ''
        })
        const rules = {
            name: [
                {
                    min: 1,
                    max: 10,
                    message: '昵称长度为1到10个字符',
                    trigger: 'blur'
                }
            ],
            sex: [
                {
                    message: 'Please select activity sex',
                    trigger: 'change'
                }
            ],
            desc: [
                {
                    min: 1,
                    max: 30,
                    message: '个人简介长度为1到30个字符',
                    trigger: 'blur'
                }
            ]
        }

        const onSubmit = () => {
            formRef.value
                .validate()
                .then(() => {
                    console.log('values', userData, toRaw(userData))
                })
                .catch(error => {
                    console.log('error', error)
                })
        }

        const resetForm = () => {
            formRef.value.ruleformState.resetFields()
        }

        return {
            formRef,
            labelCol: {
                span: 4
            },
            wrapperCol: {
                span: 10
            },
            other: '',
            userData,
            rules,
            onSubmit,
            resetForm
        }
    }
})
</script>

<style lang="less" scoped></style>
