<template>
    <div class="header">
        <div class="left"></div>
        <div class="head-right">
            <div class="message">
                <a-badge :count="10" dot>
                    <BellOutlined />
                </a-badge>
            </div>
            <div class="avatar">
                <a-dropdown>
                    <div>
                        <span class="nick_name">{{ info.nick_name }}</span>
                        <a-avatar :src="info.avatar" />
                    </div>
                    <template #overlay>
                        <a-menu>
                            <a-menu-item
                                v-for="item in userMenu"
                                :key="item.id"
                                @click="goPath(item.path)"
                            >
                                <component :is="item.icon" />
                                <span>{{ item.name }}</span>
                            </a-menu-item>
                        </a-menu>
                    </template>
                </a-dropdown>
            </div>
        </div>
    </div>
</template>

<script>
import { defineComponent, onMounted, reactive, toRefs } from 'vue'
import { BellOutlined, UserOutlined, ImportOutlined } from '@ant-design/icons-vue'
import { useRouter } from 'vue-router'
import { getUserInfo } from '@/api'
import { message } from 'ant-design-vue'
export default defineComponent({
    setup() {
        const router = useRouter()

        const state = reactive({
            info: {
                nick_name: 'admin',
                avatar: ''
            },
            userMenu: [
                {
                    id: 0,
                    name: '个人中心',
                    icon: 'UserOutlined',
                    path: '/about'
                },
                {
                    id: 0,
                    name: '退出登录',
                    icon: 'ImportOutlined',
                    path: '/login'
                }
            ]
        })

        const goPath = path => {
            if (path === '/login') {
                localStorage.clear()
                router.push('/login')
                message.success('退出成功')
            }
        }

        const getInfo = () => {
            getUserInfo().then(res => {
                localStorage.setItem('info', JSON.stringify(res.data))
                state.info = res.data
            })
        }

        onMounted(() => {
            getInfo()
        })

        return {
            ...toRefs(state),
            goPath
        }
    },
    components: {
        BellOutlined,
        UserOutlined,
        ImportOutlined
    }
})
</script>

<style lang="less" scoped>
.header {
    height: 60px;
    line-height: 60px;
    padding: 0 30px;
    border-bottom: 1px solid @border-color;
    background-color: @primary-white;
    display: flex;
    justify-content: space-between;
    .head-right {
        display: flex;
        .message {
            margin: 0 20px;
            cursor: pointer;
        }
        .avatar {
            cursor: pointer;
            .nick_name {
                margin-right: 10px;
            }
        }
    }
}
</style>
