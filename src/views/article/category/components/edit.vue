<template>
  <div>
    <v-dialog :title="title" :isShow="isShow" @close="close" @open="open" width="600px">
      <el-form ref="categoryFormRef" :model="categoryForm" :rules="rules" label-width="120px">
        <el-form-item label="类别名称" prop="name">
          <el-input v-model="categoryForm.name" placeholder="请输入类别名称" maxlength="10" show-word-limit />
        </el-form-item>
        <el-form-item label="状态" prop="status">
          <el-switch
            v-model="categoryForm.status"
            style="--el-switch-on-color: #13ce66; --el-switch-off-color: #ff4949"
          />
        </el-form-item>
        <el-form-item label="描述" prop="description">
          <el-input
            v-model="categoryForm.description"
            type="textarea"
            show-word-limit
            placeholder="请输入类别描述"
            maxlength="30"
          />
        </el-form-item>
        <el-form-item>
          <el-button @click="cancel(categoryFormRef)">取消</el-button>
          <el-button type="primary" @click="submit(categoryFormRef)" :loading="loading"> 确认 </el-button>
        </el-form-item>
      </el-form>
    </v-dialog>
  </div>
</template>
<script setup>
import vDialog from '@/components/dialog/index.vue'
import { reactive, ref, useTemplateRef } from 'vue'
import { ElMessage } from 'element-plus'
import { resetData } from '@/utils'

const props = defineProps({
  title: String,
  info: Object,
  type: Number, // 1.新增 2.编辑
  isShow: {
    type: Boolean,
    default: false
  }
})

const categoryFormRef = useTemplateRef('categoryFormRef')

let loading = ref(false)
let categoryForm = reactive({
  name: '',
  status: true,
  description: ''
})

const rules = {
  name: [{ required: true, message: '请输入类别名称', trigger: 'blur' }]
}

const emit = defineEmits(['close'])
const close = val => {
  emit('close', val)
}

const open = () => {
  if (props.type) {
    resetData(categoryForm)
    categoryForm.status = true
  } else {
    categoryForm = Object.assign(categoryForm, props.info)
    categoryForm.status = props.info.status ? true : false
  }
}

const cancel = formEl => {
  if (!formEl) {
    return
  }
  formEl.resetFields()
  close()
}

const submit = async formEl => {
  if (!formEl) {
    return
  }
  await formEl.validate((valid, fields) => {
    if (valid) {
      loading.value = true
      // if (props.type === 1) {
      // }

      // if (props.type === 2) {
      // }

      loading.value = false
      ElMessage.success('操作成功')
      close(true)
    } else {
      Promise.reject(fields)
    }
  })
}
</script>
