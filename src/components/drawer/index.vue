<template>
  <el-drawer
    class="custom-drawer"
    v-model="drawerVisible"
    :title="title"
    :direction="direction"
    :with-header="withHeader"
    :size="size"
    :modal="modal"
    :close-on-click-modal="closeOnClickModal"
    :close-on-press-escape="closeOnPressEscape"
    :show-close="showClose"
    :before-close="beforeClose"
    :destroy-on-close="true"
    @close="close"
    @open="open"
  >
    <slot></slot>
  </el-drawer>
</template>

<script setup>
import { watch, ref } from 'vue'
import { ElMessageBox } from 'element-plus'

const drawerVisible = ref(false)

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
  // 二次确认关闭提示文本
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
  size: {
    type: String,
    default: '30%'
  },
  // Drawer 打开的方向
  direction: {
    type: String,
    default: 'rtl' // 'rtl' | 'ltr' | 'ttb' | 'btt'
  },
  // 是否有头部
  withHeader: {
    type: Boolean,
    default: true
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
  // 是否可以通过按下 ESC 关闭 Dialog
  closeOnPressEscape: {
    type: Boolean,
    default: true
  },
  // 是否显示关闭按钮
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
    drawerVisible.value = val
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
