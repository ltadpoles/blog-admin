<template>
  <div>
    <v-dialog :title="title" :isShow="isShow" @close="close" @open="open" width="500px">
      <div class="reply-info">
        <div class="reply-article" v-if="articleTitle">
          <span class="reply-label">关联文章：</span>
          <span class="reply-article-title">{{ articleTitle }}</span>
        </div>
        <div class="reply-user">
          <span class="reply-label">回复对象：</span>
          <span class="reply-name">{{ replyToUserName }}</span>
        </div>
        <div class="reply-content">{{ replyContent }}</div>
      </div>
      <el-form ref="replyFormRef" :model="replyForm" :rules="rules">
        <el-form-item label="" prop="content">
          <el-input
            v-model="replyForm.content"
            type="textarea"
            :rows="4"
            :placeholder="placeholderText"
            maxlength="500"
            show-word-limit
          />
        </el-form-item>
        <div class="emoji-picker">
          <emoji-picker @select="insertEmoji" />
        </div>
        <div class="button-group">
          <el-button @click="cancel(replyFormRef)">取消</el-button>
          <el-button type="primary" @click="submit(replyFormRef)" :loading="loading"> 确认 </el-button>
        </div>
      </el-form>
    </v-dialog>
  </div>
</template>

<script setup>
import vDialog from '@/components/dialog/index.vue'
import { reactive, ref, useTemplateRef, computed } from 'vue'
import { ElMessage } from 'element-plus'
import { create } from '@/api/comment'
import EmojiPicker from '@/components/emoji-picker/index.vue'
import { useUserStore } from '@/stores/modules/user'

const props = defineProps({
  title: String,
  info: Object,
  isShow: {
    type: Boolean,
    default: false
  }
})

const replyFormRef = useTemplateRef('replyFormRef')

const userStore = useUserStore()

let loading = ref(false)
let replyForm = reactive({
  content: '',
  parentId: '',
  replyToUserName: ''
})

// 计算属性：回复对象的用户名
const replyToUserName = computed(() => {
  return props.info?.user?.name || props.info?.userName || '未知用户'
})

// 计算属性：回复的评论内容（截取前50个字符）
const replyContent = computed(() => {
  const content = props.info?.content || ''
  return content.length > 50 ? content.substring(0, 50) + '...' : content
})

// 计算属性：关联文章标题
const articleTitle = computed(() => {
  return props.info?.article?.title || '无关联文章'
})

// 计算属性：输入框的placeholder文本
const placeholderText = computed(() => {
  return `回复${replyToUserName.value}`
})

const rules = {
  content: [
    { required: true, message: '请输入回复内容', trigger: 'blur' },
    { min: 1, max: 500, message: '长度在 1 到 500 个字符', trigger: 'blur' }
  ]
}

const emit = defineEmits(['close'])
const close = val => {
  emit('close', val)
}

const open = () => {
  // 初始化表单数据
  replyForm.content = ''
  replyForm.parentId = props.info.parentId || props.info.id
  replyForm.replyToUserName = replyToUserName.value
}

const cancel = formEl => {
  if (!formEl) {
    return
  }
  formEl.resetFields()
  close()
}

// 插入emoji到回复内容
const insertEmoji = emoji => {
  replyForm.content += emoji
}

const submit = async formEl => {
  if (!formEl) {
    return
  }
  await formEl.validate(async (valid, fields) => {
    if (valid) {
      loading.value = true
      try {
        // 调用回复API
        const res = await create({
          content: replyForm.content,
          parentId: replyForm.parentId,
          replyToUserName: replyForm.replyToUserName,
          articleId: props.info.article?.id,
          name: userStore.userInfo.name,
          userId: userStore.userInfo.userId,
          email: userStore.userInfo.email,
          website: userStore.userInfo.website
        })
        loading.value = false
        ElMessage.success(res.data.msg || '回复成功')
        close(true)
      } catch (error) {
        loading.value = false
        ElMessage.error(error.msg || '回复失败')
      }
    } else {
      Promise.reject(fields)
    }
  })
}
</script>

<style lang="scss" scoped>
@use './index.scss' as *;
</style>
