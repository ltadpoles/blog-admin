<template>
  <div>
    <v-dialog :title="title" :isShow="isShow" @close="close" @open="open" width="600px">
      <el-form ref="categoryFormRef" :model="categoryForm" :rules="rules" label-width="120px">
        <el-form-item label="分类名称" prop="name">
          <el-input v-model="categoryForm.name" placeholder="请输入分类名称" maxlength="10" show-word-limit />
        </el-form-item>
        <el-form-item label="状态" prop="status">
          <el-switch v-model="categoryForm.status" />
        </el-form-item>
        <el-form-item label="描述" prop="remark">
          <el-input
            v-model="categoryForm.remark"
            type="textarea"
            show-word-limit
            placeholder="请输入分类描述"
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
import { add } from '@/api/category'
import { update } from '@/api/category'

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
  remark: ''
})

const rules = {
  name: [{ required: true, message: '请输入分类名称', trigger: 'blur' }]
}

const emit = defineEmits(['close'])
const close = val => {
  emit('close', val)
}

const open = () => {
  if (props.type === 1) {
    resetData(categoryForm)
    categoryForm.status = true
  } else {
    categoryForm = Object.assign(categoryForm, props.info)
    categoryForm.status = props.info.status === '1' ? true : false
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
      if (props.type === 1) {
        add({ ...categoryForm, status: categoryForm.status ? '1' : '0' })
          .then(res => {
            loading.value = false
            ElMessage.success(res.data.msg)
            close(true)
          })
          .finally(() => {
            loading.value = false
          })
      }

      if (props.type === 2) {
        update({ ...categoryForm, status: categoryForm.status ? '1' : '0' })
          .then(res => {
            loading.value = false
            ElMessage.success(res.data.msg)
            close(true)
          })
          .finally(() => {
            loading.value = false
          })
      }
    } else {
      Promise.reject(fields)
    }
  })
}
</script>
