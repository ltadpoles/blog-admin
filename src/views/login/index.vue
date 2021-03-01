<template>
    <div class="login">
        <div class="login-content">
            <div class="login-title">
                <img class="title-logo" src="@/assets/imgs/logo.svg" alt="" />
                <span>Blog Admin</span>
            </div>
            <a-tabs v-model:activeKey="activeKey" :tabBarStyle="tabBarStyle">
                <a-tab-pane key="1" tab="账号密码登录">
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
                            <a-button block type="primary" html-type="submit" :loading="loading"
                                >登录</a-button
                            >
                        </a-form-item>
                    </a-form>
                </a-tab-pane>
                <a-tab-pane key="2" tab="手机号登录">Content of Tab Pane 2</a-tab-pane>
            </a-tabs>
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
import { useRouter } from 'vue-router'
import md5 from 'js-md5'
export default defineComponent({
    setup() {
        const router = useRouter()

        const formRef = ref()

        const state = reactive({
            eyeFlag: false,
            loading: false,
            activeKey: '1',
            tabBarStyle: {
                border: 'none',
                textAlign: 'center'
            }
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
                    pattern: /^[a-zA-Z]{4,12}$/,
                    message: '请输入正确的用户名',
                    trigger: 'blur'
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
                    trigger: 'blur'
                }
            ]
        }

        const handleFinish = values => {
            // 前端密码加密可以做混淆
            console.log(md5(values.passWord))
            state.loading = true
            setTimeout(() => {
                state.loading = false
                router.push('/')
            }, 2000)
        }

        const handleFinishFailed = errors => {
            console.log(errors)
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
        width: 360px;
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
