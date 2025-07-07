<!-- eslint-disable vue/no-parsing-error -->
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
          <input class="edit-header-input" v-model="info.title" maxlength="20" placeholder="请输入文章标题" />
        </div>
        <div class="edit-header-right">
          <el-button type="default" @click="close">取消</el-button>

          <el-popover ref="editPopoverRef" placement="bottom" width="400" title="文章发布" trigger="click">
            <template #reference>
              <el-button type="primary">发布</el-button>
            </template>
            <div class="edit-publish">
              <el-form :model="info" label-width="80px">
                <el-form-item label="分类" prop="category">
                  <el-select v-model="info.category" :teleported="false" placeholder="请选择分类" clearable>
                    <el-option label="Zone one" value="shanghai" />
                    <el-option label="Zone two" value="beijing" />
                  </el-select>
                </el-form-item>

                <el-form-item label="标签" prop="tags">
                  <el-select v-model="info.tags" :teleported="false" placeholder="请选择标签" clearable>
                    <el-option label="Zone one" value="shanghai" />
                    <el-option label="Zone two" value="beijing" />
                  </el-select>
                </el-form-item>

                <el-form-item label="创作类型" prop="type">
                  <el-select v-model="info.type" :teleported="false" placeholder="请选择创作类型" clearable>
                    <el-option label="Zone one" value="shanghai" />
                    <el-option label="Zone two" value="beijing" />
                  </el-select>
                </el-form-item>

                <el-form-item label="原文链接" prop="link">
                  <el-input v-model="info.link" maxlength="200" placeholder="请输入原文链接" />
                </el-form-item>

                <el-form-item label="文章封面" prop="image">
                  <el-upload
                    class="avatar-uploader"
                    action="https://run.mocky.io/v3/9d059bf9-4660-45f2-925d-ce80ad6c4d15"
                    :show-file-list="false"
                    :on-success="handleAvatarSuccess"
                    :before-upload="beforeAvatarUpload"
                  >
                    <img v-if="info.image" :src="info.image" class="avatar" />
                    <el-icon v-else class="avatar-uploader-icon">
                      <Plus />
                    </el-icon>
                  </el-upload>
                </el-form-item>

                <el-form-item label="文章摘要" prop="decription">
                  <el-input
                    v-model="info.decription"
                    :rows="4"
                    resize="none"
                    type="textarea"
                    maxlength="100"
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
          class="md-editor-custom"
          v-model="info.text"
          previewTheme="default"
          codeTheme="atom"
          :footers="['markdownTotal']"
          :theme="theme"
          :language="language"
          :toolbars="toolbars"
          @onUploadImg="onUploadImg"
          @onSave="onSave"
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

const props = defineProps({
  title: String,
  id: Number,
  isShow: {
    type: Boolean,
    default: false
  },
  type: {
    type: Number,
    default: 0
  }
})

let info = reactive({})
const editPopoverRef = useTemplateRef('editPopoverRef')
const loading = ref(false)

const handleAvatarSuccess = () => {
  return true
}
const beforeAvatarUpload = () => {
  return true
}

const cancel = () => {
  editPopoverRef.value?.hide()
}
const submit = async () => {
  if (!info.category) {
    return ElMessage.error('请选择文章分类')
  }
  loading.value = true
  setTimeout(() => {
    loading.value = false
  }, 3000)
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
  'save',
  '=',
  'pageFullscreen',
  'fullscreen',
  'preview',
  'previewOnly',
  'htmlPreview',
  'catalog',
  'github'
]

const onUploadImg = async (files, callback) => {
  ElMessage.info('上传')
  const res = await Promise.all(
    files.map(file => {
      return new Promise(() => {
        const form = new FormData()
        form.append('file', file)
      })
    })
  )

  callback(res.map(item => item.data.url))
}

const onSave = (v, h) => {
  h.then(() => {
    ElMessage.info('save')
  })
}

const emit = defineEmits(['close'])
const close = value => {
  emit('close', value)
}

const open = () => {
  resetData(info)
  if (props.id) {
    getInfo(props.id)
  }
}

const getInfo = async () => {
  ElMessage.success('获取数据成功')
}
</script>

<style lang="scss" scoped>
@use './index.scss' as *;
</style>
