<template>
    <div class="login">
        <div class="login-content">
            <div class="login-title">
                <img class="title-logo" src="@/assets/imgs/logo.svg" alt="" />
                <span>Blog Admin</span>
            </div>
            <a-form
                name="custom-validation"
                class="login-form"
                ref="formRef"
                :model="formState"
                :rules="rules"
                v-bind="layout"
                @finish="handleFinish"
                @finishFailed="handleFinishFailed"
            >
                <a-form-item has-feedback name="userName">
                    <a-input
                        v-model:value="formState.userName"
                        autocomplete="off"
                        placeholder="账号"
                    >
                        <template #prefix>
                            <UserOutlined />
                        </template>
                    </a-input>
                </a-form-item>
                <a-form-item has-feedback name="passWord">
                    <a-input
                        v-model:value="formState.passWord"
                        type="password"
                        autocomplete="off"
                        placeholder="密码"
                        visibilityToggle
                    >
                        <template #prefix>
                            <LockOutlined />
                        </template>
                    </a-input>
                </a-form-item>
                <a-form-item>
                    <a-button block type="primary" html-type="submit">登录</a-button>
                </a-form-item>
            </a-form>
        </div>
    </div>
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

        // let validateUser = async (rule, value) => {
        //     if (value === '') {
        //         return Promise.reject('请输入用户名')
        //     } else {
        //         return Promise.resolve()
        //     }
        // }

        // let validatePass = async (rule, value) => {
        //     if (value === '') {
        //         return Promise.reject('请输入密码')
        //     } else {
        //         return Promise.resolve()
        //     }
        // }

        const rules = {
            userName: [
                {
                    required: true,
                    message: '请输入用户名',
                    trigger: 'blur'
                }
                // {
                //     validator: validateUser,
                //     trigger: 'change'
                // }
            ],
            passWord: [
                {
                    required: true,
                    message: '请输入密码',
                    trigger: 'blur'
                }
                // {
                //     validator: validatePass,
                //     trigger: 'change'
                // }
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

        const layout = {
            wrapperCol: {
                span: 24
            }
        }

        return {
            formState,
            formRef,
            rules,
            handleFinishFailed,
            handleFinish,
            resetForm,
            layout
        }
    },
    components: {
        UserOutlined,
        LockOutlined
    }
})
</script>

<style lang="less" scoped>
.login {
    height: 100vh;
    background: url('../../assets/imgs/login.svg') no-repeat;
    background-size: cover;
    display: flex;
    justify-content: center;
    .login-content {
        width: 400px;
        margin-top: 20px;
        .login-title {
            display: flex;
            justify-content: center;
            height: 100px;
            line-height: 100px;
            font-size: 24px;
            font-weight: 700;
            .title-logo {
                width: 40px;
                margin-right: 15px;
            }
        }
    }
}
</style>
