<template>
    <div class="header">
        <div class="left">left</div>
        <div class="head-right">right</div>
    </div>
</template>

<script>
import { defineComponent } from 'vue'
export default defineComponent({
    setup() {
        return {}
    }
})
</script>

<style lang="less" scoped>
.header {
    height: 60px;
    line-height: 60px;
    padding: 0 10px;
    border-bottom: 1px solid @border-color;
    display: flex;
    justify-content: space-between;
}
</style>
