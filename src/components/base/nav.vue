<template>
    <div class="nav" :class="{ 'menu-small': collapsed }">
        <h1 class="logo">Admin</h1>
        <div class="menu">
            <a-menu
                mode="inline"
                theme="dark"
                :inline-collapsed="collapsed"
                v-model:openKeys="openKeys"
                v-model:selectedKeys="selectedKeys"
            >
                <a-menu-item key="1">
                    <PieChartOutlined />
                    <span>Option 1</span>
                </a-menu-item>
                <a-sub-menu key="sub1">
                    <template #title>
                        <span>
                            <MailOutlined />
                            <span>Navigation One</span>
                        </span>
                    </template>
                    <a-menu-item key="5">Option 5</a-menu-item>
                    <a-menu-item key="6">Option 6</a-menu-item>
                </a-sub-menu>
                <a-sub-menu key="sub2">
                    <template #title>
                        <span>
                            <AppstoreOutlined />
                            <span>Navigation Two</span>
                        </span>
                    </template>
                    <a-menu-item key="9">Option 9</a-menu-item>
                    <a-menu-item key="10">Option 10</a-menu-item>
                    <a-sub-menu key="sub3" title="Submenu">
                        <a-menu-item key="11">Option 11</a-menu-item>
                        <a-menu-item key="12">Option 12</a-menu-item>
                    </a-sub-menu>
                </a-sub-menu>
            </a-menu>
        </div>
        <div class="toogle">
            <MenuFoldOutlined @click="toggleCollapsed" v-if="collapsed" />
            <MenuFoldOutlined @click="toggleCollapsed" v-else />
        </div>
    </div>
</template>

<script>
import { MenuFoldOutlined, PieChartOutlined, MailOutlined, AppstoreOutlined } from '@ant-design/icons-vue'
import { defineComponent, reactive, toRefs, watch } from 'vue'
export default defineComponent({
    setup() {
        const state = reactive({
            selectedKeys: ['1'],
            openKeys: ['sub1'],
            preOpenKeys: ['sub1'],
            collapsed: false
        })

        watch(
            () => state.openKeys,
            (val, oldVal) => {
                state.preOpenKeys = oldVal
            }
        )

        const toggleCollapsed = () => {
            state.collapsed = !state.collapsed
            state.openKeys = state.collapsed ? [] : state.preOpenKeys
        }

        return {
            ...toRefs(state),
            toggleCollapsed
        }
    },
    components: {
        MenuFoldOutlined,
        PieChartOutlined,
        MailOutlined,
        AppstoreOutlined
    }
})
</script>

<style lang="less" scoped>
.nav {
    height: 100vh;
    width: 180px;
    display: flex;
    flex-direction: column;
    background-color: @primary-blank;
    transition: all 0.2s;
    .logo {
        height: 50px;
        line-height: 50px;
        padding-left: 20px;
        color: @primary-white;
        margin: 0;
    }
    .menu {
        height: calc(100vh - 90px);
        overflow: auto;
    }
    .toogle {
        height: 40px;
        line-height: 40px;
        padding-left: 30px;
        color: @primary-white;
        cursor: pointer;
    }
}

// 菜单切换
.menu-small {
    width: 80px;
}
</style>
