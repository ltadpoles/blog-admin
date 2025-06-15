import { computed } from 'vue'

export const useCommon = () => {
  const getDropdownItemStyle = computed(() => {
    return (a, b) => {
      return {
        background: a === b ? 'var(--el-color-primary)' : '',
        color: a === b ? '#f4f4f5' : ''
      }
    }
  })
  return {
    getDropdownItemStyle
  }
}
