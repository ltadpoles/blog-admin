<template>
    <a-form
        name="custom-validation"
        ref="formRef"
        :model="formState"
        :rules="rules"
        @finish="handleFinish"
        @finishFailed="handleFinishFailed"
    >
        <a-form-item has-feedback name="user">
            <a-input v-model:value="formState.pass" autocomplete="off">
                <template #prefix>
                    <UserOutlined />
                </template>
            </a-input>
        </a-form-item>
        <a-form-item has-feedback name="passWord">
            <a-input v-model:value="formState.checkPass" type="password" autocomplete="off">
                <template #prefix>
                    <LockOutlined />
                </template>
            </a-input>
        </a-form-item>
        <a-form-item>
            <a-button block type="primary" html-type="submit">登录</a-button>
        </a-form-item>
    </a-form>
</template>
<script>
import { defineComponent, reactive, ref } from 'vue'
import { UserOutlined, LockOutlined } from '@ant-design/icons-vue'
export default defineComponent({
    setup() {
        const formRef = ref()

        const formState = reactive({
            userName: '',
            passWord: ''
        })

        let validateUser = async (rule, value) => {
            if (value === '') {
                return Promise.reject('请输入用户名')
            } else {
                return Promise.resolve()
            }
        }

        let validatePass = async (rule, value) => {
            if (value === '') {
                return Promise.reject('请输入密码')
            } else {
                if (formState.checkPass !== '') {
                    formRef.value.validateField('checkPass')
                }
                return Promise.resolve()
            }
        }

        const rules = {
            user: [
                {
                    validator: validateUser,
                    trigger: 'change'
                }
            ],
            passWord: [
                {
                    validator: validatePass,
                    trigger: 'change'
                }
            ]
        }

        const handleFinish = values => {
            console.log(values, formState)
        }

        const handleFinishFailed = errors => {
            console.log(errors)
        }

        const resetForm = () => {
            formRef.value.resetFields()
        }

        return {
            formState,
            formRef,
            rules,
            handleFinishFailed,
            handleFinish,
            resetForm
        }
    },
    components: {
        UserOutlined,
        LockOutlined
    }
})
</script>
