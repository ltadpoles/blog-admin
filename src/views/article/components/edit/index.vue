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

          <el-popover ref="editPopoverRef" placement="bottom" width="520" title="文章发布" trigger="click">
            <template #reference>
              <el-button type="primary">保存</el-button>
            </template>
            <div class="edit-publish">
              <el-form :model="info" label-width="80px">
                <el-form-item label="分类" prop="category">
                  <el-select v-model="info.category" :teleported="false" placeholder="请选择分类" clearable>
                    <el-option :label="item.name" :value="item.id" v-for="item in categorysList" :key="item.id" />
                  </el-select>
                </el-form-item>

                <el-form-item label="标签" prop="tags">
                  <el-select
                    v-model="info.tags"
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

                <el-form-item label="创作类型" prop="type">
                  <el-select v-model="info.type" :teleported="false" placeholder="请选择创作类型" clearable>
                    <el-option :label="item.label" :value="item.id" v-for="item in typeList" :key="item.id" />
                  </el-select>
                </el-form-item>

                <el-form-item label="原文链接" prop="link">
                  <el-input v-model="info.link" maxlength="200" placeholder="请输入原文链接" />
                </el-form-item>

                <el-form-item label="文章封面" prop="image">
                  <el-upload
                    class="avatar-uploader"
                    :headers="headers"
                    :action="action"
                    :show-file-list="false"
                    :on-success="handleAvatarSuccess"
                    :before-upload="beforeAvatarUpload"
                  >
                    <img v-if="info.image" :src="ImgUrl + info.image" class="avatar" />
                    <el-icon v-else class="avatar-uploader-icon">
                      <Plus />
                    </el-icon>
                  </el-upload>
                </el-form-item>

                <el-form-item label="文章摘要" prop="description">
                  <el-input
                    v-model="info.description"
                    :rows="4"
                    resize="none"
                    type="textarea"
                    maxlength="50"
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
          v-model="info.content"
          previewTheme="github"
          codeTheme="atom"
          :footers="['markdownTotal']"
          :codeFoldable="false"
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
import { upload } from '@/api'
import { taglist } from '@/api/tag'
import { categorylist } from '@/api/category'
import { add } from '@/api/article'
import { useUserStore } from '@/stores/modules/user'

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
const ImgUrl = import.meta.env.VITE_HTTP_BASEURL + '/file/download?fileId='
const action = import.meta.env.VITE_HTTP_BASEURL + '/file/upload'
const headers = {
  Authorization: `Bearer ${userStore.token.token}`
}

const mdEditorRef = useTemplateRef('mdEditorRef')

let info = reactive({
  content: '# Hell World'
})
const typeList = ref([
  {
    label: '原创',
    id: 1
  },
  {
    label: '转载',
    id: 2
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
  info.image = file.data.fileId
}
const beforeAvatarUpload = () => {
  return true
}

const cancel = () => {
  editPopoverRef.value?.hide()
}

const submit = async () => {
  if (!info.title) {
    return ElMessage.error('请输入文章标题')
  }
  if (!info.content) {
    return ElMessage.error('请输入文章内容')
  }
  if (!info.category) {
    return ElMessage.error('请选择文章分类')
  }
  if (!info.tags || !info.tags.length) {
    return ElMessage.error('请选择文章标签')
  }
  if (!info.type) {
    return ElMessage.error('请选择创作类型')
  }
  if (info.type === '2' && !info.link) {
    return ElMessage.error('请输入原文链接')
  }
  if (!info.image) {
    return ElMessage.error('请上传文章封面')
  }
  if (!info.description) {
    return ElMessage.error('请输入文章摘要')
  }
  loading.value = true
  mdEditorRef.value?.triggerSave()

  add(info)
    .then(res => {
      ElMessage.success(res.data.msg)
      close(true)
    })
    .finally(() => {
      loading.value = false
    })
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
  ElMessage.info('上传')
  const res = await Promise.all(
    files.map(file => {
      return new Promise((rev, rej) => {
        const form = new FormData()
        form.append('file', file)

        upload(form)
          .then(res => {
            ElMessage.success('上传成功')
            rev(res)
          })
          .catch(err => {
            ElMessage.error('上传失败')
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
  getCateGoryList()
  getTagList()
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
