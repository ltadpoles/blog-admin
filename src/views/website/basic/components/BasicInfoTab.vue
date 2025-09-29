<template>
  <el-form ref="formRef" :model="formData" label-width="120px" :rules="rules">
    <el-row :gutter="20">
      <el-col :span="12">
        <el-form-item label="网站名称" prop="siteName">
          <el-input v-model="localFormData.siteName" placeholder="请输入网站名称" />
        </el-form-item>
      </el-col>
      <el-col :span="12">
        <el-form-item label="网站URL" prop="siteUrl">
          <el-input v-model="localFormData.siteUrl" placeholder="请输入网站URL" />
        </el-form-item>
      </el-col>
    </el-row>

    <el-form-item label="网站描述" prop="siteDescription">
      <el-input v-model="localFormData.siteDescription" type="textarea" :rows="3" placeholder="请输入网站描述" />
    </el-form-item>

    <el-form-item label="网站关键词" prop="siteKeywords">
      <el-input
        v-model="localFormData.siteKeywords"
        type="textarea"
        :rows="2"
        placeholder="请输入网站关键词，用逗号分隔"
      />
    </el-form-item>

    <el-form-item label="网站Logo" prop="siteLogo">
      <div class="logo-upload-container">
        <el-upload
          class="logo-uploader"
          :headers="headers"
          :action="action"
          :show-file-list="false"
          :on-success="handleLogoSuccess"
          :before-upload="beforeLogoUpload"
        >
          <img v-if="localLogo" :src="ImgUrl + localLogo" class="logo" />
          <el-icon v-else class="logo-uploader-icon">
            <Plus />
          </el-icon>
        </el-upload>
        <div class="upload-tip">点击上传Logo，支持JPG、PNG、SVG格式，建议尺寸200x80px，自动保持宽高比</div>
      </div>
    </el-form-item>

    <el-form-item label="网站公告" prop="siteNotice">
      <el-input v-model="localFormData.siteNotice" type="textarea" :rows="3" placeholder="请输入网站公告" />
    </el-form-item>
  </el-form>
</template>

<script setup>
import { useTemplateRef, computed, ref, watch } from 'vue'
import { Plus } from '@element-plus/icons-vue'
import { useUserStore } from '@/stores/modules/user'
import config from '@/config'
import { compressImage, getCompressPresets } from '@/utils/imageCompress'
import { ElMessage } from 'element-plus'

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

// 本地Logo数据
const localLogo = ref(props.formData.siteLogo)

// 监听props变化，同步更新本地Logo数据
watch(
  () => props.formData.siteLogo,
  newValue => {
    localLogo.value = newValue
  },
  { immediate: true }
)

// 本地表单数据，避免直接修改props
const localFormData = computed({
  get: () => props.formData,
  set: value => emit('update:formData', value)
})

const userStore = useUserStore()

const ImgUrl = config.HTTPBASEURL + '/file/download?fileId='
const action = config.HTTPBASEURL + '/file/upload'
const headers = {
  Authorization: `Bearer ${userStore.token.token}`
}

// Logo上传成功回调
const handleLogoSuccess = file => {
  // 更新本地Logo数据
  localLogo.value = file.data.fileId
  // 同时更新父组件数据
  emit('update:formData', {
    ...props.formData,
    siteLogo: file.data.fileId
  })
}

// Logo上传前验证和压缩
const beforeLogoUpload = async file => {
  const isImage = file.type === 'image/jpeg' || file.type === 'image/png' || file.type === 'image/svg+xml'
  const isLt5M = file.size / 1024 / 1024 < 5

  if (!isImage) {
    ElMessage.error('Logo图片只能是 JPG/PNG/SVG 格式!')
    return false
  }
  if (!isLt5M) {
    ElMessage.error('Logo图片大小不能超过 5MB!')
    return false
  }

  try {
    // 获取Logo压缩配置
    const logoPreset = getCompressPresets().logo

    // 压缩图片（SVG会自动跳过压缩）
    const compressedFile = await compressImage(file, logoPreset)

    return compressedFile
  } catch {
    ElMessage.error('图片压缩失败，请重试')
    return false
  }
}

// 暴露验证方法给父组件
defineExpose({
  validate: () => formRef.value?.validate()
})
</script>

<style lang="scss" scoped>
.logo-upload-container {
  display: flex;
  flex-direction: column;
  align-items: flex-start;
}

.logo-uploader {
  .logo {
    width: 200px;
    height: 80px;
    object-fit: contain;
    border: 1px dashed #d9d9d9;
    display: block;
  }

  .logo-uploader-icon {
    font-size: 24px;
    color: #8c939d;
    width: 200px;
    height: 80px;
    border: 1px dashed #d9d9d9;
    display: flex;
    align-items: center;
    justify-content: center;
    cursor: pointer;
    transition: border-color 0.3s;

    &:hover {
      border-color: #409eff;
    }
  }
}

.upload-tip {
  font-size: 12px;
  color: #909399;
  margin-top: 12px;
  line-height: 1.4;
  text-align: left;
}
</style>
