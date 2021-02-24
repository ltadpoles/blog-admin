<template>
    <div class="layout">
        <div>
            <app-nav />
        </div>
        <div>
            <app-header />
            <router-view />
            <app-footer />
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

<style lang="less" scoped></style>
