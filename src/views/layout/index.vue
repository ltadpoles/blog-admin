<template>
    <div class="layout">
        <div class="app-nav">
            <app-nav />
        </div>
        <div class="app-content">
            <div class="app-header">
                <app-header />
            </div>
            <div class="content">
                <router-view />
            </div>
            <div class="app-footer">
                <app-footer />
            </div>
        </div>
    </div>
</template>

<script>
import appHeader from '@/components/base/header.vue'
import appNav from '@/components/base/nav.vue'
import appFooter from '@/components/base/footer.vue'
export default {
    name: 'Layout',
    components: {
        appHeader,
        appNav,
        appFooter
    }
}
</script>

<style lang="less" scoped>
.layout {
    // overflow: hidden;
    display: flex;
    .app-content {
        flex: 1;
        .content {
            min-height: calc(100% - 120px);
        }
    }
}
</style>
