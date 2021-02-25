<template>
    <a-layout-sider v-model:collapsed="collapsed" breakpoint="lg" collapsible class="nav">
        <div class="logo" />
        <a-menu theme="dark" v-model:selectedKeys="selectedKeys" mode="inline">
            <a-menu-item v-for="item in list" :key="item.id">
                <component :is="item.icon" />
                <span>{{ item.name }}</span>
            </a-menu-item>
        </a-menu>
    </a-layout-sider>
</template>

<script>
import { PieChartOutlined, DesktopOutlined, UserOutlined, TeamOutlined, FileOutlined } from '@ant-design/icons-vue'
import { defineComponent, reactive, toRefs } from 'vue'
export default defineComponent({
    setup() {
        const state = reactive({
            selectedKeys: [0],
            collapsed: false,
            list: [
                { id: 0, name: '文章', path: '/article', icon: 'PieChartOutlined' },
                { id: 1, name: '留言管理', path: '/board', icon: 'DesktopOutlined' },
                { id: 2, name: '关于', path: '/about', icon: 'UserOutlined' }
            ]
        })

        return {
            ...toRefs(state)
        }
    },
    components: {
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
        margin: 16px;
        background: rgba(255, 255, 255, 0.3);
    }
}
</style>
