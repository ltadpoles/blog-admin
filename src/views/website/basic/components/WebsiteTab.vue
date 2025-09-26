<template>
  <el-form ref="formRef" :model="formData" label-width="120px" :rules="rules">
    <el-form-item label="维护模式" prop="isMaintenance">
      <el-switch v-model="localFormData.isMaintenance" :active-value="'1'" :inactive-value="'0'" />
      <span class="ml-2 text-gray-500">开启后网站将进入维护模式</span>
    </el-form-item>

    <el-form-item v-if="localFormData.isMaintenance === '1'" label="维护提示" prop="maintenanceMessage">
      <el-input
        v-model="localFormData.maintenanceMessage"
        type="textarea"
        :rows="3"
        placeholder="请输入维护模式提示信息"
      />
    </el-form-item>

    <el-form-item label="评论审核" prop="isCommentAuditEnabled">
      <el-switch v-model="localFormData.isCommentAuditEnabled" :active-value="'1'" :inactive-value="'0'" />
      <span class="ml-2 text-gray-500">开启后评论需要审核才能显示</span>
    </el-form-item>

    <el-form-item label="留言审核" prop="isBoardAuditEnabled">
      <el-switch v-model="localFormData.isBoardAuditEnabled" :active-value="'1'" :inactive-value="'0'" />
      <span class="ml-2 text-gray-500">开启后留言需要审核才能显示</span>
    </el-form-item>

    <el-row :gutter="20">
      <el-col :span="12">
        <el-form-item label="版权信息" prop="siteCopyright">
          <el-input v-model="localFormData.siteCopyright" placeholder="请输入版权信息" />
        </el-form-item>
      </el-col>
      <el-col :span="12">
        <el-form-item label="ICP备案号" prop="siteIcp">
          <el-input v-model="localFormData.siteIcp" placeholder="请输入ICP备案号" />
        </el-form-item>
      </el-col>
    </el-row>

    <el-form-item label="备注" prop="remark">
      <el-input v-model="localFormData.remark" type="textarea" :rows="3" placeholder="请输入网站设置备注信息" />
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

<style lang="scss" scoped>
.ml-2 {
  margin-left: 8px;
}

.text-gray-500 {
  color: #6b7280;
  font-size: 14px;
}
</style>
