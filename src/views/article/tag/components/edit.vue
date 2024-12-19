<template>
  <v-drawer :title="title" :isShow="isShow" @close="close" @open="open">
    <div class="drawer-content" v-loading="isLoading">
      <el-form ref="tagEditFormRef" :model="form" label-width="100px" :rules="rules">
        <el-form-item label="标签名称" prop="name">
          <el-input v-model="form.name" maxlength="50" placeholder="请输入标签名称" />
        </el-form-item>
        <el-form-item label="标签状态" prop="status">
          <el-select v-model="form.status" placeholder="请选择标签状态" clearable filterable>
            <el-option label="有效" value="1" />
            <el-option label="无效" value="0" />
          </el-select>
        </el-form-item>
        <el-form-item label="备注" prop="remark">
          <el-input v-model="form.remark" maxlength="50" :rows="2" type="textarea" placeholder="请输入备注" />
        </el-form-item>
      </el-form>
      <div class="drawer-footer">
        <el-button @click="close(false)">取消</el-button>
        <el-button type="primary" :loading="loading" @click="submit(tagEditFormRef)">确认</el-button>
      </div>
    </div>
  </v-drawer>
</template>
<script setup>
import { reactive, ref } from 'vue'
import vDrawer from '@/components/drawer/index.vue'
import { ElMessage } from 'element-plus'
import { resetData } from '@/utils'
import { add, info, update } from '@/api/tag'

const props = defineProps({
  title: String,
  id: {},
  type: {
    type: Number,
    default: 1
  },
  isShow: {
    type: Boolean,
    default: false
  }
})

const isLoading = ref(false)

const tagEditFormRef = ref()
let form = reactive({})
const loading = ref(false)

const rules = {
  name: [
    { required: true, message: '请输入标签名称', trigger: 'blur' },
  ],
  status: [
    { required: true, message: '请选择标签状态', trigger: 'change' },
  ],
  remark: [
    { required: true, message: '请输入描述', trigger: 'blur' },
  ],
}

const submit = async (formEl) => {
  if (!formEl) {
    return
  }
  await formEl.validate(async (valid, fields) => {
    if (valid) {
      loading.value = true
      if (props.type === 1) {
        await add({ ...form }).finally(() => {
          loading.value = false
        })
        close(true)
      }
      if (props.type === 2) {
        await update({ ...form, id: props.id }).finally(() => {
          loading.value = false
        })
        close(true)
      }

      ElMessage.success('操作成功')

    } else {
      Promise.reject(fields)
    }
  })
}

const getInfo = async (id) => {
  let { data } = await info({ id })
  form = Object.assign(form, data.data)
}

const emit = defineEmits(['close', 'open'])
const close = val => {
  resetData(form)
  emit('close', val)
}

const open = async () => {
  if (props.type === 2) {
    isLoading.value = true
    getInfo(props.id).finally(() => {
      isLoading.value = false
    })
  }
}
</script>
<style lang="less" scoped></style>