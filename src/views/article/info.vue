<template>
    <div class="article-info">
        <div class="head">
            <div class="title">{{ info.title }}</div>

            <div class="head-item">
                <div class="left">
                    <a-tag color="#87d068">{{ info.type === 1 ? '原创' : '转载' }}</a-tag>
                    <div class="author">{{ info.user.nick_name }}</div>
                    <div class="publish_time">{{ info.publish_time }}</div>
                </div>
                <div class="modify" @click="toModdify" v-if="getState(info.userId)">编辑</div>
            </div>
        </div>
        <div class="img">
            <img :src="info.image" alt="" />
        </div>
        <div class="content">
            <v-md-preview model="preview" v-html="info.html" height="500px"></v-md-preview>
            <div class="tag">
                <a-tag v-for="item in info.tag" :key="item.id" color="cyan">{{ item.name }}</a-tag>
            </div>
        </div>
        <div class="footer"></div>
    </div>
</template>

<script>
import { onMounted, reactive, toRefs } from 'vue'
import { getArticleInfo } from '@/api/article'
import { useRoute, useRouter } from 'vue-router'
import { getState } from '@/utils'
import moment from 'moment'
export default {
    setup() {
        const router = useRouter()
        const route = useRoute()

        const { query } = route

        const state = reactive({
            info: {
                title: '',
                publish_time: 0,
                html: '',
                type: 1,
                user: {},
                tag: []
            }
        })

        const getInfo = id => {
            getArticleInfo(id).then(res => {
                res.data.publish_time = moment(res.data.publish_time).format('YYYY-MM-DD HH:mm')
                state.info = res.data
            })
        }

        const toModdify = () => {
            router.push({ path: '/article-publish', query: { id: state.info.id } })
        }

        onMounted(() => {
            getInfo(query.id)
        })

        return {
            ...toRefs(state),
            getState,
            toModdify
        }
    }
}
</script>

<style lang="less" scoped>
.article-info {
    .head {
        .title {
            font-size: 24px;
            text-align: center;
            margin-bottom: 15px;
        }
        .head-item {
            display: flex;
            justify-content: space-between;
            padding: 0 20px;
            font-size: 12px;
            color: @primary-gray;
            .left {
                display: flex;
                align-items: center;
                .author {
                    margin-right: 10px;
                    font-size: 14px;
                    color: @primary-blank;
                }
            }
            .modify {
                cursor: pointer;
            }
        }
    }
    .img {
        text-align: center;
        margin-top: 20px;
        img {
            width: 80%;
        }
    }
    .content {
        .tag {
            padding: 0 20px;
        }
    }
}
</style>
