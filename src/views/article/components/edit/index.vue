<template>
  <v-dialog
    :isShow="isShow"
    :title="title"
    :showClose="false"
    @close="close"
    @open="open"
    fullscreen
    class="article-dialog"
  >
    <div class="edit">文章编辑</div>
  </v-dialog>
</template>
<script setup>
import { reactive } from 'vue'
import vDialog from '@/components/dialog/index.vue'
import { resetData } from '@/utils'
import { ElMessage } from 'element-plus'

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

let info = reactive({
  title: '',
  content: ''
})

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
