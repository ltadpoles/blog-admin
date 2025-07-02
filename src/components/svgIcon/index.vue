<template>
  <svg
    aria-hidden="true"
    class="svg-icon"
    :style="{ marginRight: marginRight, cursor: cursor, minWidth: width, minHeight: height }"
    :width="width"
    :height="height"
  >
    <use :xlink:href="symbolId" :fill="color" />
  </svg>
</template>

<script setup>
import { computed } from 'vue'
const props = defineProps({
  prefix: {
    type: String,
    default: 'icon'
  },
  name: {
    type: String,
    required: true
  },
  color: {
    type: String,
    default: 'currentcolor'
  },
  width: {
    type: String,
    default: '1rem'
  },
  height: {
    type: String,
    default: '1rem'
  },
  marginRight: {
    type: String,
    default: '0px'
  },
  cursor: {
    type: String,
    default: 'pointer'
  }
})

const symbolId = computed(() => `#${props.prefix}-${props.name}`)
</script>
