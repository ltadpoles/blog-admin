<template>
  <div class="login">
    <div class="login-container">
      <div class="login-container-left">
        <SvgIcon name="login" width="38rem" height="30rem" />
      </div>
      <div class="login-container-right">
        <div class="login-content">
          <div class="login-content-title">后台管理系统</div>
          <el-form class="login-form" ref="ruleFormRef" :model="ruleForm" :rules="rules">
            <el-form-item label="" prop="username">
              <el-input
                v-model="ruleForm.username"
                :prefix-icon="User"
                size="large"
                placeholder="请输入用户名"
                clearable
              />
            </el-form-item>
            <el-form-item label="" prop="password">
              <el-input
                v-model="ruleForm.password"
                :prefix-icon="Lock"
                size="large"
                type="password"
                placeholder="请输入密码"
                show-password
                clearable
              />
            </el-form-item>
            <el-form-item>
              <el-button type="primary" @click="submitForm(ruleFormRef)" auto-insert-space class="login-form-button">
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
import { useTemplateRef, reactive } from 'vue'
import { User, Lock } from '@element-plus/icons-vue'

const userStore = useUserStore()
const router = useRouter()

const ruleFormRef = useTemplateRef('ruleFormRef')
const ruleForm = reactive({
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
      await userStore.getInfoAction()
      router.push('/')
    } else {
      return false
    }
  })
}
</script>

<style lang="scss" scoped>
@use './index.scss' as *;
</style>
