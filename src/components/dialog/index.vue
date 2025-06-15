<template>
  <el-dialog
    v-model="dialogVisible"
    :title="title"
    :width="width"
    :fullscreen="fullscreen"
    :modal="modal"
    :close-on-click-modal="closeOnClickModal"
    :close-on-press-escape="closeOnPressEscape"
    :show-close="showClose"
    :before-close="beforeClose"
    center
    :destroy-on-close="true"
    @close="close"
    @open="open"
  >
    <slot></slot>
  </el-dialog>
</template>

<script setup>
import { watch, ref } from 'vue'
import { ElMessageBox } from 'element-plus'

const dialogVisible = ref(false)

const props = defineProps({
  // 是否显示 Dialog
  isShow: {
    type: Boolean
  },
  // 是否有二次确认关闭提示
  confirmCancel: {
    type: Boolean,
    default: false
  },
  closeText: {
    type: String,
    default: '是否确认关闭改弹窗？'
  },
  // Dialog 对话框 Dialog 的标题
  title: {
    type: String,
    default: '新增'
  },
  // Dialog 的宽度
  width: {
    type: String,
    default: '50%'
  },
  // 是否为全屏 Dialog
  fullscreen: {
    type: Boolean,
    default: false
  },
  // 是否需要遮罩层
  modal: {
    type: Boolean,
    default: true
  },
  // 是否可以通过点击 modal 关闭 Dialog
  closeOnClickModal: {
    type: Boolean,
    default: true
  },
  closeOnPressEscape: {
    type: Boolean,
    default: true
  },
  showClose: {
    type: Boolean,
    default: true
  }
})

const emit = defineEmits(['close', 'open'])

// props 不支持 v-modal 绑定的值，所以这里使用 watch 的方式添加一个变量
watch(
  () => props.isShow,
  val => {
    dialogVisible.value = val
  }
)

const beforeClose = done => {
  if (props.confirmCancel) {
    ElMessageBox.confirm(props.closeText, '提示', {
      confirmButtonText: '确定',
      cancelButtonText: '取消',
      type: 'warning'
    })
      .then(() => {
        done()
      })
      .catch(() => {
        Promise.reject('弹窗关闭')
      })
  } else {
    done()
  }
}

const close = () => {
  emit('close', false)
}

const open = () => {
  emit('open')
}
</script>
