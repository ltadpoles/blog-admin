<template>
  <div class="login">
    <div class="login-content">
      <div class="login-content-logo">
        <img src="@/assets/images/login.svg" alt="" />
      </div>
      <div class="login-content-form">
        <h1>后台管理系统</h1>
        <el-form ref="loginFormRef" :model="loginForm" :rules="rules" class="demo-loginForm" status-icon>
          <el-form-item label="" prop="username">
            <el-input v-model="loginForm.username" placeholder="请输入账号" prefix-icon="User" />
          </el-form-item>
          <el-form-item label="" prop="password">
            <el-input v-model="loginForm.password" placeholder="请输入密码" type="password" prefix-icon="Lock" />
          </el-form-item>
          <el-form-item>
            <el-button type="primary" round :loading="loading" class="login-btn" @click="login(loginFormRef)">
              登录
            </el-button>
          </el-form-item>
        </el-form>
        <div class="forgot-password">忘记密码</div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { reactive, ref } from 'vue'
// import { loginIn } from '@/api/user'
// import sha256 from 'crypto-js/sha256'
// import { useUserStore } from '@/stores/modules/user'
// import { useRouter, useRoute } from 'vue-router'

// const router = useRouter()
// const route = useRoute()

const loading = ref(false)
const loginFormRef = ref()

const loginForm = reactive({
  username: '',
  password: ''
})

const rules = ref({
  username: [{ required: true, message: '请输入账号', trigger: 'blur' }],
  password: [{ required: true, message: '请输入密码', trigger: 'blur' }]
})

const login = async (formEl) => {
  if (!formEl) {
    return
  }

  await formEl.validate(async (valid, fields) => {
    if (valid) {
      loading.value = true
      // loginIn({
      //   username: loginForm.username,
      //   password: sha256(loginForm.password).toString()
      // }).then(async res => {
      //   const userStore = useUserStore()
      //   userStore.setToken(res.data.data)
      //   // const { data } = await getUserInfo()
      //   // console.log(data)
      //   router.replace(route.query.redirect || '/')
      // }).finally(() => {
      //   loading.value = false
      // })
    } else {
      Promise.reject(fields)
    }
  })
}
</script>

<style lang="less" scoped>
.login {
  height: 100vh;
  width: 100vw;
  overflow: hidden;
  display: flex;
  align-items: center;
  justify-content: center;

  .login-content {
    height: 480px;
    display: flex;
    padding: 20px 120px;
    box-shadow: var(--el-box-shadow);
    border-radius: 10px;

    .login-content-logo {
      display: flex;
      align-items: center;
    }

    .login-content-logo>img {
      width: 260px;
    }

    .login-content-form {
      margin-left: 100px;
      width: 280px;
      text-align: center;
      flex: 1;

      h1 {
        padding: 50px 0;
      }

      .login-btn {
        width: 100%;
        margin-top: 30px;
      }

      .forgot-password {
        font-size: 12px;
        cursor: pointer;
      }
    }
  }
}
</style>
