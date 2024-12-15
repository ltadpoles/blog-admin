<template>
  <v-drawer :title="title" :isShow="isShow" @close="close" @open="open">
    <div class="drawer-content" v-loading="isLoading">
      <el-form ref="menuEditFormRef" :model="form" label-width="60px" :rules="rules">
        <el-form-item label="编号" prop="code">
          <el-input v-model="form.code" maxlength="50" placeholder="请输入编号" />
        </el-form-item>
        <el-form-item label="名称" prop="name">
          <el-input v-model="form.name" maxlength="50" placeholder="请输入名称" />
        </el-form-item>
        <el-form-item label="类型" prop="type">
          <el-select v-model="form.type" placeholder="请选择类型" clearable filterable>
            <el-option label="菜单" value="1" />
            <el-option label="按钮" value="2" />
          </el-select>
        </el-form-item>
        <el-form-item label="路径" prop="url">
          <el-input v-model="form.url" placeholder="请输入路径" />
        </el-form-item>
        <el-form-item label="图标" prop="icon">
          <el-input v-model="form.icon" placeholder="请输入图标" />
        </el-form-item>
        <el-form-item label="备注" prop="remark">
          <el-input v-model="form.remark" maxlength="200" :rows="2" type="textarea" placeholder="请输入备注" />
        </el-form-item>
      </el-form>
      <div class="drawer-footer">
        <el-button @click="close(false)">取消</el-button>
        <el-button type="primary" :loading="loading" @click="submit(menuEditFormRef)">确认</el-button>
      </div>
    </div>
  </v-drawer>
</template>
<script setup>
import { reactive, ref } from 'vue'
import vDrawer from '@/components/drawer/index.vue'
import { ElMessage } from 'element-plus'
import { resetData } from '@/utils'
import { add, info } from '@/api/menu'

const props = defineProps({
  title: String,
  id: Number,
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

const menuEditFormRef = ref()
let form = reactive({})
const loading = ref(false)

const rules = {
  code: [
    { required: true, message: '请输入编号', trigger: 'blur' },
  ],
  name: [
    { required: true, message: '请输入名称', trigger: 'blur' },
  ],
  type: [
    { required: true, message: '请选择类型', trigger: 'change' },
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
        let { data } = await add({ ...form, parentId: props.id }).finally(() => {
          loading.value = false
        })
        close(data.data)
      }
      if (props.type === 2) {
        // await productLineupdate({ ...form, id: props.id }).finally(() => {
        //     loading.value = false
        // })
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