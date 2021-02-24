<template>
    <div id="app">
        <router-view />
    </div>
</template>

<script>
export default {
    name: 'App'
}
</script>

<style lang="less" scoped>
#app {
    font-family: 'MingChaoTi';
    margin: 0;
    color: @red;
    font-size: @font-size;
}
</style>
