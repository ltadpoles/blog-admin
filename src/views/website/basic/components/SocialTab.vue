<template>
  <el-form ref="formRef" :model="formData" label-width="120px" :rules="rules">
    <el-form-item label="Github地址" prop="githubUrl">
      <el-input v-model="localFormData.githubUrl" placeholder="请输入Github地址">
        <template #prefix>
          <el-icon><Link /></el-icon>
        </template>
      </el-input>
    </el-form-item>

    <el-form-item label="Gitee地址" prop="giteeUrl">
      <el-input v-model="localFormData.giteeUrl" placeholder="请输入Gitee地址">
        <template #prefix>
          <el-icon><Monitor /></el-icon>
        </template>
      </el-input>
    </el-form-item>

    <el-form-item label="QQ号" prop="qqNumber">
      <el-input v-model="localFormData.qqNumber" placeholder="请输入QQ号">
        <template #prefix>
          <el-icon><ChatDotRound /></el-icon>
        </template>
      </el-input>
    </el-form-item>

    <el-form-item label="QQ群" prop="qqGroup">
      <el-input v-model="localFormData.qqGroup" placeholder="请输入QQ群号">
        <template #prefix>
          <el-icon><User /></el-icon>
        </template>
      </el-input>
    </el-form-item>

    <el-form-item label="微信" prop="wechat">
      <el-input v-model="localFormData.wechat" placeholder="请输入微信号">
        <template #prefix>
          <el-icon><ChatDotRound /></el-icon>
        </template>
      </el-input>
    </el-form-item>

    <el-form-item label="邮箱" prop="email">
      <el-input v-model="localFormData.email" placeholder="请输入邮箱地址">
        <template #prefix>
          <el-icon><Message /></el-icon>
        </template>
      </el-input>
    </el-form-item>
  </el-form>
</template>

<script setup>
import { useTemplateRef, computed } from 'vue'

const props = defineProps({
  formData: {
    type: Object,
    required: true
  },
  rules: {
    type: Object,
    required: true
  }
})

const emit = defineEmits(['update:formData'])

const formRef = useTemplateRef('formRef')

// 本地表单数据，避免直接修改props
const localFormData = computed({
  get: () => props.formData,
  set: value => emit('update:formData', value)
})

// 暴露验证方法给父组件
defineExpose({
  validate: () => formRef.value?.validate()
})
</script>
