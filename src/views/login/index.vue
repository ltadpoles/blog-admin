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
                        :type="eyeFlag ? 'text' : 'password'"
                        autocomplete="off"
                        placeholder="密码"
                        visibilityToggle
                    >
                        <template #prefix>
                            <LockOutlined />
                        </template>
                        <template #suffix>
                            <component
                                :is="eyeFlag ? 'EyeOutlined' : 'EyeInvisibleOutlined'"
                                @click="eyeClick"
                            />
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
import { defineComponent, reactive, ref, toRefs } from 'vue'
import {
    UserOutlined,
    LockOutlined,
    EyeOutlined,
    EyeInvisibleOutlined
} from '@ant-design/icons-vue'
export default defineComponent({
    setup() {
        const formRef = ref()

        const state = reactive({
            eyeFlag: false
        })

        const formState = reactive({
            userName: '',
            passWord: ''
        })

        const rules = {
            userName: [
                {
                    required: true,
                    message: '请输入用户名',
                    trigger: 'blur'
                },
                {
                    // 字母开头且只能使用字母、数字和下划线
                    pattern: /^[a-zA-Z]\w{6,12}$/,
                    message: '请输入正确的用户名',
                    trigger: 'blue'
                }
            ],
            passWord: [
                {
                    required: true,
                    message: '请输入密码',
                    trigger: 'blur'
                },
                {
                    pattern: /^[a-zA-Z]\w{6,12}$/,
                    message: '请输入正确的密码',
                    trigger: 'blue'
                }
            ]
        }

        const handleFinish = values => {
            console.log(values, formState)
        }

        const handleFinishFailed = errors => {
            console.log(errors, 11223)
        }

        const eyeClick = () => {
            state.eyeFlag = !state.eyeFlag
        }

        const layout = {
            wrapperCol: {
                span: 24
            }
        }

        return {
            ...toRefs(state),
            formState,
            formRef,
            eyeClick,
            rules,
            handleFinishFailed,
            handleFinish,
            layout
        }
    },
    components: {
        UserOutlined,
        LockOutlined,
        EyeOutlined,
        EyeInvisibleOutlined
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
            font-size: 26px;
            font-weight: 700;
            .title-logo {
                width: 40px;
                margin-right: 15px;
            }
        }
    }
}
</style>
