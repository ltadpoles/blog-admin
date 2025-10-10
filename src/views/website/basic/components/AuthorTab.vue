<template>
  <el-form ref="formRef" :model="formData" label-width="120px" :rules="rules">
    <el-form-item label="头像设置" prop="authorAvatar">
      <div class="avatar-upload-container">
        <el-upload
          class="avatar-uploader"
          :headers="headers"
          :action="action"
          :show-file-list="false"
          :on-success="handleAvatarSuccess"
          :before-upload="beforeAvatarUpload"
          :on-error="handleAvatarError"
        >
          <img v-if="localAvatar" :src="ImgUrl + localAvatar" class="avatar" />
          <el-icon v-else class="avatar-uploader-icon">
            <Plus />
          </el-icon>
        </el-upload>
        <div class="upload-tip">点击上传头像，支持JPG、PNG、SVG格式，建议尺寸200x200px，自动保持宽高比</div>
      </div>
    </el-form-item>

    <el-form-item label="作者名称" prop="authorName">
      <el-input v-model="localFormData.authorName" placeholder="请输入作者名称" />
    </el-form-item>

    <el-form-item label="个性签名" prop="authorBio">
      <el-input
        v-model="localFormData.authorBio"
        type="textarea"
        :rows="3"
        placeholder="请输入个性签名"
        maxlength="200"
        show-word-limit
      />
    </el-form-item>

    <el-form-item label="关于我" prop="authorAbout">
      <MdEditor
        ref="mdEditorRef"
        class="md-editor-custom"
        v-model="localFormData.authorAbout"
        previewTheme="github"
        codeTheme="atom"
        :footers="[]"
        :codeFoldable="false"
        :theme="theme"
        :language="language"
        :toolbars="toolbars"
        @onUploadImg="onUploadImg"
      >
        <template #defToolbars>
          <Emoji />
        </template>
      </MdEditor>
    </el-form-item>
  </el-form>
</template>

<script setup>
import { useTemplateRef, computed, ref, watch } from 'vue'
import { MdEditor } from 'md-editor-v3'
import 'md-editor-v3/lib/style.css'
import { Emoji } from '@vavt/v3-extension'
import '@vavt/v3-extension/lib/asset/Emoji.css'
import { upload } from '@/api'
import { useUserStore } from '@/stores/modules/user'
import { useSettingStore } from '@/stores/modules/setting'
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
const mdEditorRef = useTemplateRef('mdEditorRef')

// 本地头像数据
const localAvatar = ref(props.formData.authorAvatar)

// 监听props变化，同步更新本地头像数据
watch(
  () => props.formData.authorAvatar,
  newValue => {
    localAvatar.value = newValue
  },
  { immediate: true }
)

// 本地表单数据，避免直接修改props
const localFormData = computed({
  get: () => ({
    ...props.formData,
    authorAbout: props.formData.authorAbout || '' // 确保authorAbout始终是字符串
  }),
  set: value => emit('update:formData', value)
})

const userStore = useUserStore()
const settingStore = useSettingStore()

const ImgUrl = config.HTTPBASEURL + '/file/download?fileId='
const action = config.HTTPBASEURL + '/file/upload'
const headers = {
  Authorization: `Bearer ${userStore.token.token}`
}

// 头像上传成功回调
const handleAvatarSuccess = file => {
  // 更新本地头像数据
  localAvatar.value = file.data.fileId
  // 同时更新父组件数据
  emit('update:formData', {
    ...props.formData,
    authorAvatar: file.data.fileId
  })
}

// 头像上传错误处理
const handleAvatarError = err => {
  try {
    // 尝试解析错误信息
    if (err?.message) {
      const errorData = JSON.parse(err.message)
      ElMessage.error(errorData?.msg || '头像上传失败，请重试')
    } else {
      ElMessage.error('头像上传失败，请重试')
    }
  } catch {
    // JSON 解析失败时的降级处理
    ElMessage.error(err?.message || '头像上传失败，请重试')
  }
}

// 头像上传前验证和压缩
const beforeAvatarUpload = async file => {
  const isImage = file.type === 'image/jpeg' || file.type === 'image/png' || file.type === 'image/svg+xml'
  const isLt5M = file.size / 1024 / 1024 < 5

  if (!isImage) {
    ElMessage.error('头像图片只能是 JPG/PNG/SVG 格式!')
    return false
  }
  if (!isLt5M) {
    ElMessage.error('头像图片大小不能超过 5MB!')
    return false
  }

  try {
    // 获取头像压缩配置
    const avatarPreset = getCompressPresets().avatar

    // 压缩图片（SVG会自动跳过压缩）
    const compressedFile = await compressImage(file, avatarPreset)

    return compressedFile
  } catch {
    ElMessage.error('图片压缩失败，请重试')
    return false
  }
}

// 主题设置
const theme = computed(() => {
  return settingStore.isDark ? 'dark' : 'light'
})

const language = computed(() => {
  return settingStore.lang === 'en' ? 'en-US' : 'zh-CN'
})

// 编辑器工具栏配置
const toolbars = [
  0,
  'bold',
  'underline',
  'italic',
  'strikeThrough',
  '-',
  'title',
  'sub',
  'sup',
  'quote',
  'unorderedList',
  'orderedList',
  'task',
  '-',
  'codeRow',
  'code',
  'link',
  'image',
  'table',
  'mermaid',
  '-',
  'revoke',
  'next',
  '=',
  'pageFullscreen',
  'fullscreen',
  'preview',
  'previewOnly',
  'catalog',
  'github'
]

// 图片上传处理
const onUploadImg = async (files, callback) => {
  try {
    // 获取编辑器图片压缩配置
    const editorPreset = getCompressPresets().editor

    // 批量压缩图片
    const compressedFiles = await Promise.all(
      files.map(async file => {
        try {
          return await compressImage(file, editorPreset)
        } catch {
          return file
        }
      })
    )

    const res = await Promise.all(
      compressedFiles.map(file => {
        return new Promise((rev, rej) => {
          const form = new FormData()
          form.append('file', file)
          form.append('type', 'other') // 设置上传类型为other

          upload(form)
            .then(res => {
              rev(res)
            })
            .catch(err => {
              rej(err)
            })
        })
      })
    )

    callback(
      res.map(item => ({
        url: ImgUrl + item.data.data.fileId,
        alt: 'IMG.ALT'
      }))
    )
  } catch {
    //
  }
}

// 暴露验证方法给父组件
defineExpose({
  validate: () => formRef.value?.validate()
})
</script>

<style lang="scss" scoped>
.avatar-upload-container {
  display: flex;
  flex-direction: column;
  align-items: flex-start;
}

.avatar-uploader {
  .avatar {
    width: 100px;
    height: 100px;
    border-radius: 50%;
    object-fit: cover;
    border: 1px dashed #d9d9d9;
    display: block;
  }

  .avatar-uploader-icon {
    font-size: 24px;
    color: #8c939d;
    width: 100px;
    height: 100px;
    border-radius: 50%;
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

.md-editor-custom {
  height: 400px;
}

:deep(.emojis li) {
  height: 32px;
}
</style>
