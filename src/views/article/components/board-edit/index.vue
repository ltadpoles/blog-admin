<template>
  <div>
    <v-dialog :title="title" :isShow="isShow" @close="close" @open="open" width="400px">
      <el-form ref="borderFormRef" :model="boardForm" label-width="120px">
        <el-form-item label="是否置顶">
          <el-switch v-model="boardForm.top" :active-value="'1'" :inactive-value="'0'" />
        </el-form-item>
        <el-form-item label="是否私密">
          <el-switch v-model="boardForm.isPrivate" :active-value="'1'" :inactive-value="'0'" />
        </el-form-item>
        <el-form-item label="是否可回复">
          <el-switch v-model="boardForm.isReply" :active-value="'1'" :inactive-value="'0'" />
        </el-form-item>
        <el-form-item>
          <el-button @click="cancel(borderFormRef)">取消</el-button>
          <el-button type="primary" @click="submit(borderFormRef)" :loading="loading"> 确认 </el-button>
        </el-form-item>
      </el-form>
    </v-dialog>
  </div>
</template>
<script setup>
import vDialog from '@/components/dialog/index.vue'
import { reactive, ref, useTemplateRef } from 'vue'
import { ElMessage } from 'element-plus'
import { update } from '@/api/message'

const props = defineProps({
  title: String,
  info: Object,
  isShow: {
    type: Boolean,
    default: false
  }
})

const borderFormRef = useTemplateRef('borderFormRef')

let loading = ref(false)
let boardForm = reactive({})

const emit = defineEmits(['close'])
const close = val => {
  emit('close', val)
}

const open = () => {
  boardForm = Object.assign(boardForm, props.info)
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

      update({ id: boardForm.id, isPrivate: boardForm.isPrivate, isReply: boardForm.isReply, top: boardForm.top })
        .then(res => {
          loading.value = false
          ElMessage.success(res.data.msg)
          close(true)
        })
        .finally(() => {
          loading.value = false
        })
    } else {
      Promise.reject(fields)
    }
  })
}
</script>
