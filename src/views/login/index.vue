<template>
  <div class="login">
    <div class="login-container">
      <div class="login-container-left">
        <SvgIcon name="login" width="38rem" height="30rem" />
      </div>
      <div class="login-container-right">
        <div class="login-content">
          <div class="login-content-title">后台管理系统</div>
          <el-form class="login-form" ref="formRef" :model="form" :rules="rules">
            <el-form-item label="" prop="username">
              <el-input v-model="form.username" :prefix-icon="User" size="large" placeholder="请输入用户名" clearable />
            </el-form-item>
            <el-form-item label="" prop="password">
              <el-input
                v-model="form.password"
                :prefix-icon="Lock"
                size="large"
                type="password"
                placeholder="请输入密码"
                show-password
                clearable
              />
            </el-form-item>
            <el-form-item>
              <el-button
                :loading="loading"
                type="primary"
                @click="submitForm(formRef)"
                auto-insert-space
                class="login-form-button"
              >
                登录
              </el-button>
            </el-form-item>
          </el-form>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { useUserStore } from '@/stores/modules/user'
import { useRouter } from 'vue-router'
import { useTemplateRef, reactive, ref } from 'vue'
import { User, Lock } from '@element-plus/icons-vue'
import { login } from '@/api/admin'
import sha256 from 'crypto-js/sha256'
import { useRoute } from 'vue-router'

const userStore = useUserStore()
const router = useRouter()
const route = useRoute()

const loading = ref(false)
const formRef = useTemplateRef('formRef')
const form = reactive({
  username: '',
  password: ''
})

const rules = reactive({
  username: [{ required: true, message: '请输入用户名', trigger: 'blur' }],
  password: [{ required: true, message: '请输入密码', trigger: 'blur' }]
})

const submitForm = formRef => {
  formRef.validate(async valid => {
    if (valid) {
      loading.value = true
      let { data } = await login({
        username: form.username,
        password: sha256(form.password).toString()
      }).finally(() => {
        loading.value = false
      })
      userStore.setToken(data.data)
      await userStore.getInfoAction()
      router.replace(route.query.redirect || '/')
    } else {
      return false
    }
  })
}
</script>

<style lang="scss" scoped>
@use './index.scss' as *;
</style>
