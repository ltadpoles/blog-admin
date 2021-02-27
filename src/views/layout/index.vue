<template>
    <a-layout class="layout">
        <app-nav />
        <a-layout>
            <app-header />
            <a-layout-content class="content">
                <a-breadcrumb class="content-bread">
                    <a-breadcrumb-item>
                        <router-link to="/"><home-outlined /></router-link>
                    </a-breadcrumb-item>
                    <a-breadcrumb-item>{{ route.meta.text }}</a-breadcrumb-item>
                </a-breadcrumb>
                <div class="content-view">
                    <router-view />
                </div>
            </a-layout-content>
            <app-footer />
        </a-layout>
    </a-layout>
</template>
<script>
import { defineComponent } from 'vue'
import { useRoute } from 'vue-router'
import { HomeOutlined } from '@ant-design/icons-vue'
import appNav from '@/components/base/nav.vue'
import appHeader from '@/components/base/header.vue'
import appFooter from '@/components/base/footer.vue'

export default defineComponent({
    setup() {
        const route = useRoute()

        return {
            route
        }
    },
    components: {
        appNav,
        appHeader,
        appFooter,
        HomeOutlined
    }
})
</script>
<style lang="less" scoped>
.layout {
    height: 100vh;
    .content {
        margin: 0 10px;
        .content-bread {
            padding: 16px 0;
        }
        .content-view {
            background-color: @primary-white;
            padding: 20px;
            min-height: 360px;
            border-radius: 5px;
        }
    }
}
</style>
