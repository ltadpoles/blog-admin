<template>
  <el-popover
    ref="popoverRef"
    placement="bottom"
    width="380"
    trigger="click"
    popper-class="emoji-popper"
    v-model:visible="visible"
  >
    <template #reference>😄</template>
    <div class="emoji-container">
      <div class="emoji-box">
        <button class="emoji-item" v-for="e in groupedEmojis" :key="e" type="button" @click="selectEmoji(e)">
          {{ e }}
        </button>
      </div>
    </div>
  </el-popover>
</template>

<script setup>
import { ref } from 'vue'

const popoverRef = ref(null)
const visible = ref(false)

const groupedEmojis = [
  // 表情
  '😄',
  '😁',
  '😆',
  '😊',
  '🙂',
  '😉',
  '🤩',
  '🥳',
  '🥰',
  '😍',
  '😘',
  '😗',
  '😚',
  '🤗',
  '😎',
  '🤓',
  '🥺',
  '🤠',
  '😡',
  '😠',
  '🤬',
  '😤',
  '😢',
  '😭',
  '😟',
  '😣',
  '🤧',
  '😱',
  '😨',
  '😰',
  '😥',
  '😓',
  '😖',
  '😞',
  '🤯',
  '😱',
  '😳',
  '😧',
  '😲',
  '😵',
  '😴',
  '🤤',
  '😪',
  '🥱',
  '🥴',
  '🤮',
  '🤢',
  '😷',
  '🤒',
  '🤕',
  '👿',
  '💀',
  '👻',
  '💩',
  '🤖',
  '👽',
  '👊',
  '👏',
  '🤝',
  '👍',
  '👎',
  '🙌',
  '🤲',
  '👐',
  '💅',
  '🤳',
  '💪',
  '❤️',
  '🧡',
  '💛',
  '💚',
  '💙',
  '💜',
  '🖤',
  '💔'
]

// 选中表情后关闭popover
const selectEmoji = emoji => {
  // 触发select事件
  emit('select', emoji)
  // 关闭popover
  visible.value = false
}

const emit = defineEmits(['select'])
</script>

<style lang="scss" scoped>
@use './index.scss' as *;
</style>
