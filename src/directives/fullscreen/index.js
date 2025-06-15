import { useFullscreen } from '@vueuse/core'

export const fullscreen = {
  mounted(el, binding) {
    const { value } = binding
    const { toggle } = useFullscreen(value && value === 'bind' ? el : null)
    el.addEventListener('click', () => {
      toggle()
    })
  }
}
