<template>
  <v-dialog
    :isShow="isShow"
    :title="title"
    :showClose="false"
    :closeOnClickModal="false"
    :closeOnPressEscape="false"
    @close="close"
    @open="open"
    fullscreen
    class="article-dialog"
  >
    <div class="edit">
      <div class="edit-header">
        <div class="edit-header-left">
          <input class="edit-header-input" v-model="infoData.title" maxlength="50" placeholder="请输入文章标题" />
        </div>
        <div class="edit-header-right">
          <el-button type="default" @click="close">取消</el-button>

          <el-popover ref="editPopoverRef" placement="bottom" width="520" title="文章发布" trigger="click">
            <template #reference>
              <el-button type="primary">保存</el-button>
            </template>
            <div class="edit-publish">
              <el-form :model="infoData" label-width="80px">
                <el-form-item label="分类" prop="category">
                  <el-select v-model="infoData.category" :teleported="false" placeholder="请选择分类" clearable>
                    <el-option :label="item.name" :value="item.id" v-for="item in categorysList" :key="item.id" />
                  </el-select>
                </el-form-item>

                <el-form-item label="标签" prop="tags">
                  <el-select
                    v-model="infoData.tags"
                    :teleported="false"
                    :multiple-limit="3"
                    multiple
                    placeholder="请选择标签"
                    clearable
                  >
                    <template #header> 最多选择3个标签 </template>
                    <el-option :label="item.name" :value="item.id" v-for="item in tagsList" :key="item.id" />
                  </el-select>
                </el-form-item>

                <el-form-item label="开启评论" prop="isComment">
                  <el-radio-group v-model="infoData.isComment">
                    <el-radio value="1">是</el-radio>
                    <el-radio value="0">否</el-radio>
                  </el-radio-group>
                </el-form-item>

                <el-form-item label="创作类型" prop="type">
                  <el-select v-model="infoData.type" :teleported="false" placeholder="请选择创作类型" clearable>
                    <el-option :label="item.label" :value="item.id" v-for="item in typeList" :key="item.id" />
                  </el-select>
                </el-form-item>

                <el-form-item label="原文链接" prop="link">
                  <el-input v-model="infoData.link" maxlength="200" placeholder="请输入原文链接" />
                </el-form-item>

                <el-form-item label="文章封面" prop="coverImgId">
                  <div class="cover-upload-container">
                    <el-upload
                      class="avatar-uploader"
                      :headers="headers"
                      :action="action"
                      :show-file-list="false"
                      :on-success="handleAvatarSuccess"
                      :before-upload="beforeAvatarUpload"
                      :on-error="handleAvatarError"
                    >
                      <img v-if="infoData.coverImgId" :src="ImgUrl + infoData.coverImgId" class="avatar" />
                      <el-icon v-else class="avatar-uploader-icon">
                        <Plus />
                      </el-icon>
                    </el-upload>
                    <div class="upload-tip">
                      点击上传封面，支持JPG、PNG、SVG格式，建议尺寸1200x800px，自动保持宽高比
                    </div>
                  </div>
                </el-form-item>

                <el-form-item label="文章摘要" prop="description">
                  <el-input
                    v-model="infoData.description"
                    :rows="4"
                    resize="none"
                    type="textarea"
                    maxlength="200"
                    show-word-limit
                    placeholder="请输入文章摘要"
                  />
                </el-form-item>
              </el-form>
              <div class="edit-publish-footer">
                <el-button type="default" @click="cancel">取消</el-button>
                <el-button type="primary" :loading="loading" @click="submit">确认发布</el-button>
              </div>
            </div>
          </el-popover>
        </div>
      </div>
      <div class="edit-main">
        <MdEditor
          ref="mdEditorRef"
          class="md-editor-custom"
          v-model="infoData.content"
          previewTheme="github"
          codeTheme="atom"
          :footers="['markdownTotal']"
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
      </div>
    </div>
  </v-dialog>
</template>
<script setup>
import { reactive, computed, ref, useTemplateRef } from 'vue'
import vDialog from '@/components/dialog/index.vue'
import { resetData } from '@/utils'
import { ElMessage } from 'element-plus'
import { useSettingStore } from '@/stores/modules/setting'

import { MdEditor } from 'md-editor-v3'
import 'md-editor-v3/lib/style.css'
import { Emoji } from '@vavt/v3-extension'
import '@vavt/v3-extension/lib/asset/Emoji.css'
import { upload } from '@/api'
import { taglist } from '@/api/tag'
import { categorylist } from '@/api/category'
import { add, info, update } from '@/api/article'
import { useUserStore } from '@/stores/modules/user'
import config from '@/config'
import { compressImage, getCompressPresets } from '@/utils/imageCompress'

const props = defineProps({
  title: String,
  id: Number,
  isShow: {
    type: Boolean,
    default: false
  },
  type: {
    type: Number,
    default: 1
  }
})

const userStore = useUserStore()
const ImgUrl = config.HTTPBASEURL + '/file/download?fileId='
const action = config.HTTPBASEURL + '/file/upload'
const headers = {
  Authorization: `Bearer ${userStore.token.token}`
}

let infoData = reactive({
  content: '### 标题',
  isComment: '1' // 默认开启评论
})
const typeList = ref([
  {
    label: '原创',
    id: '1'
  },
  {
    label: '转载',
    id: '2'
  }
])
const editPopoverRef = useTemplateRef('editPopoverRef')
const loading = ref(false)

const tagsList = ref([])
const categorysList = ref([])
const getTagList = async () => {
  let { data } = await taglist({ status: '1' })
  tagsList.value = data.data
}
const getCateGoryList = async () => {
  let { data } = await categorylist({ status: '1' })
  categorysList.value = data.data
}

const handleAvatarSuccess = file => {
  infoData.coverImgId = file.data.fileId
}

const handleAvatarError = err => {
  try {
    if (err?.message) {
      const errorData = JSON.parse(err.message)
      ElMessage.error(errorData?.msg || '图片上传失败，请重试')
    } else {
      ElMessage.error('图片上传失败，请重试')
    }
  } catch {
    //
  }
}

// 封面图片上传前验证和压缩
const beforeAvatarUpload = async file => {
  const isImage = file.type === 'image/jpeg' || file.type === 'image/png' || file.type === 'image/svg+xml'
  const isLt5M = file.size / 1024 / 1024 < 5

  if (!isImage) {
    ElMessage.error('封面图片只能是 JPG/PNG/SVG 格式!')
    return false
  }
  if (!isLt5M) {
    ElMessage.error('封面图片大小不能超过 5MB!')
    return false
  }

  try {
    // 获取封面压缩配置
    const coverPreset = getCompressPresets().cover

    // 压缩图片（SVG会自动跳过压缩）
    const compressedFile = await compressImage(file, coverPreset)

    return compressedFile
  } catch {
    ElMessage.error('图片压缩失败，请重试')
    return false
  }
}

const cancel = () => {
  editPopoverRef.value?.hide()
}

const submit = async () => {
  if (!infoData.title) {
    return ElMessage.error('请输入文章标题')
  }
  if (!infoData.content) {
    return ElMessage.error('请输入文章内容')
  }
  if (!infoData.category) {
    return ElMessage.error('请选择文章分类')
  }
  if (!infoData.tags || !infoData.tags.length) {
    return ElMessage.error('请选择文章标签')
  }
  if (!infoData.type) {
    return ElMessage.error('请选择创作类型')
  }
  if (infoData.type === '2' && !infoData.link) {
    return ElMessage.error('请输入原文链接')
  }
  if (!infoData.coverImgId) {
    return ElMessage.error('请上传文章封面')
  }
  if (!infoData.description) {
    return ElMessage.error('请输入文章摘要')
  }
  loading.value = true

  if (props.type === 1) {
    add(infoData)
      .then(res => {
        ElMessage.success(res.data.msg)
        close(true)
      })
      .finally(() => {
        loading.value = false
      })
  }

  if (props.type === 2) {
    update(infoData)
      .then(res => {
        ElMessage.success(res.data.msg)
        close(true)
      })
      .finally(() => {
        loading.value = false
      })
  }
}

const settingStore = useSettingStore()

const theme = computed(() => {
  return settingStore.isDark ? 'dark' : 'light'
})
const language = computed(() => {
  return settingStore.lang === 'en' ? 'en-US' : 'zh-CN'
})

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

    const res = await Promise.allSettled(
      compressedFiles.map(file => {
        const form = new FormData()
        form.append('file', file)
        return upload(form)
      })
    )

    // 检查是否有上传失败的图片
    const failedUploads = res.filter(result => result.status === 'rejected')
    if (failedUploads.length > 0) {
      // 如果有上传失败的图片，显示错误信息
      // 注意：全局HTTP拦截器已经显示了具体的错误消息
      // 这里只显示统计信息
      ElMessage.error(`${failedUploads.length} 张图片上传失败`)
    }

    // 只处理成功的上传结果
    const successfulUploads = res.filter(result => result.status === 'fulfilled').map(result => result.value)

    callback(
      successfulUploads.map(item => ({
        url: ImgUrl + item.data.data.fileId,
        alt: 'IMG.ALT'
      }))
    )
  } catch (error) {
    // 如果错误已经被全局HTTP拦截器处理，则不显示额外消息
    // 否则显示通用错误消息
    if (!error?.response) {
      ElMessage.error('图片上传失败，请重试')
    }
  }
}

const emit = defineEmits(['close'])
const close = value => {
  resetData(infoData)
  emit('close', value)
}

const open = () => {
  getCateGoryList()
  getTagList()
  if (props.id) {
    getInfo(props.id)
  }
}

const getInfo = async id => {
  let { data } = await info({ id })
  infoData = Object.assign(infoData, data.data)
  infoData.tags = infoData.tag.map(item => item.id)
  infoData.category = infoData.category[0]?.id
}
</script>

<style lang="scss" scoped>
@use './index.scss' as *;
</style>
