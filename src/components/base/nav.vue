<template>
    <a-layout-sider
        v-model:collapsed="collapsed"
        breakpoint="lg"
        collapsible
        class="nav"
        :theme="theme"
    >
        <div class="logo" :class="{ 'fold-logo': collapsed }">
            <img src="@/assets/imgs/logo.svg" alt="" />
            <h1 v-if="!collapsed">Admin</h1>
        </div>
        <a-menu :theme="theme" v-model:selectedKeys="selectedKeys" mode="inline">
            <a-menu-item v-for="item in menu" :key="item.id">
                <router-link :to="item.path">
                    <component :is="item.icon" />
                    <span>{{ item.name }}</span>
                </router-link>
            </a-menu-item>
        </a-menu>
    </a-layout-sider>
</template>

<script>
import {
    HomeOutlined,
    PieChartOutlined,
    DesktopOutlined,
    UserOutlined,
    TeamOutlined,
    FileOutlined
} from '@ant-design/icons-vue'
import { defineComponent, onMounted, reactive, toRefs } from 'vue'
import { onBeforeRouteUpdate, useRoute } from 'vue-router'
import { getUserMenu } from '@/api'
export default defineComponent({
    setup() {
        const route = useRoute()

        const state = reactive({
            selectedKeys: [0], // 默认选中菜单
            collapsed: false, // 菜单折叠状态
            theme: 'dark', // 主题颜色
            menu: []
        })

        const getMenu = () => {
            getUserMenu().then(res => {
                state.menu = res.data

                state.selectedKeys = state.menu
                    .filter(item => item.path === route.path)
                    .map(item => item.id)
            })
        }
        // 监听路由变化设置选中menu
        onBeforeRouteUpdate(to => {
            state.selectedKeys = state.menu
                .filter(item => item.path === to.path)
                .map(item => item.id)
        })

        onMounted(() => {
            getMenu()
        })

        return {
            ...toRefs(state)
        }
    },
    components: {
        HomeOutlined,
        PieChartOutlined,
        DesktopOutlined,
        UserOutlined,
        TeamOutlined,
        FileOutlined
    }
})
</script>

<style lang="less" scoped>
.nav {
    overflow: auto;
    height: 100vh;
    .logo {
        height: 32px;
        line-height: 32px;
        margin: 10px 20px;
        display: flex;
        transition: all 0.2s;
        > img {
            width: 30px;
            padding-right: 10px;
        }
        > h1 {
            color: @primary-white;
        }
    }
    .fold-logo {
        margin-left: 30px;
    }
}
</style>
