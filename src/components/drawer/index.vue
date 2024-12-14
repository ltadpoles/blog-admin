<template>
  <el-drawer v-model="dialogVisible"
             :title="title"
             :before-close="beforeClose"
             :modal="modal"
             :direction="direction"
             :show-close="showClose"
             :size="size"
             :with-header="withHeader"
             :close-on-press-escape="closeOnPressEscape"
             :destroy-on-close="true"
             :close-on-click-modal="false"
             @close="close">
    <slot></slot>
  </el-drawer>
</template>

<script setup>
import { watch, ref } from 'vue'
import { ElMessageBox } from 'element-plus'

const dialogVisible = ref(false)

const props = defineProps({
  // 是否显示 Drawer
  isShow: {
    type: Boolean,
    default: false
  },
  // Drawer 对话框 Drawer 的标题
  title: {
    type: String,
    default: '新增'
  },
  // Drawer 的宽度
  size: {
    default: 500
  },
  // 是否需要遮罩层
  modal: {
    type: Boolean,
    default: true
  },
  // Drawer 打开的方向 'rtl' | 'ltr' | 'ttb' | 'btt'
  direction: {
    type: String,
    default: 'rtl'
  },
  // 通过esc关闭弹窗
  closeOnPressEscape: {
    type: Boolean,
    default: false
  },
  // 是否需要关闭提示
  confirmCancel: {
    type: Boolean,
    default: false
  },
  // 确认关闭提示
  closeText: {
    type: String,
    default: '离开将不会保存当前数据，是否退出?'
  },
  // 是否显示关闭按钮
  showClose: {
    type: Boolean,
    default: true
  },
  // 控制是否显示 header 栏, 默认为 true, 当此项为 false 时, title attribute 和 title slot 均不生效
  withHeader: {
    type: Boolean,
    default: true
  }
})

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
        close()
        done()
      })
  } else {
    close()
    done()
  }
}

const emit = defineEmits(['close'])
const close = () => {
  emit('close', false)
}
</script>