<template>
    <div class="article">
        <div class="article-title">
            <div class="article-title-search">
                <a-input v-model:value="title" placeholder="文章名称" class="title-input" />
                <a-range-picker
                    v-model:value="date"
                    :locale="zhCN"
                    class="title-input title-range"
                    :placeholder="placeholder"
                />
                <a-button type="primary" @click="search">查询</a-button>
            </div>
            <div class="article-title-add">
                <a-button type="primary">
                    <template #icon><PlusOutlined /></template>添加文章
                </a-button>
            </div>
        </div>
        <div class="article-content">
            <a-table
                class="ant-table-striped"
                :columns="columns"
                :dataSource="articleSource"
                :pagination="pagination"
                :loading="loading"
                :rowClassName="(record, index) => (index % 2 === 1 ? 'table-striped' : null)"
                @change="handleTableChange"
            >
                <template #image="{ text: image }">
                    <img class="article-image" :src="image" alt="" />
                </template>
                <template #tags="{ text: tags }">
                    <span>
                        <a-tag v-for="tag in tags" :key="tag" :color="tag.color">
                            {{ tag.name }}
                        </a-tag>
                    </span>
                </template>
                <template #action="{ record }">
                    <span>
                        <span class="modify" @click="del(record.key)">修改</span>
                        <a-divider type="vertical" />
                        <span class="del" @click="del(record.key)">删除</span>
                    </span>
                </template>
            </a-table>
        </div>
    </div>
</template>

<script>
import { PlusOutlined } from '@ant-design/icons-vue'
import { computed, defineComponent, reactive, toRefs } from 'vue'
import zhCN from 'ant-design-vue/lib/locale-provider/zh_CN'
import moment from 'moment'
import 'moment/locale/zh-cn'
moment.locale('zh-cn')

const columns = [
    {
        title: '文章图片',
        dataIndex: 'image',
        slots: {
            customRender: 'image'
        }
    },
    {
        title: '标题',
        dataIndex: 'name'
    },
    {
        title: '标签',
        dataIndex: 'tags',
        slots: {
            customRender: 'tags'
        }
    },
    {
        title: '发布时间',
        dataIndex: 'publishDate'
    },
    {
        title: '修改时间',
        dataIndex: 'modifyDate'
    },
    {
        title: '浏览量',
        dataIndex: 'pvCount'
    },
    {
        title: '点赞数',
        dataIndex: 'likeCount'
    },
    {
        title: '操作',
        key: 'action',
        slots: { customRender: 'action' }
    }
]

export default defineComponent({
    setup() {
        const state = reactive({
            title: '',
            date: [],
            placeholder: ['开始时间', '结束时间'],
            loading: false,
            articleSource: [
                {
                    key: 0,
                    image: 'https://zos.alipayobjects.com/rmsportal/ODTLcjxAfvqbxHnVXCYX.png',
                    name: '我的第一篇文章',
                    tags: [
                        {
                            name: 'JavaScript',
                            color: 'geekblue'
                        },
                        {
                            name: 'Vue',
                            color: 'blue'
                        },
                        {
                            name: 'React',
                            color: 'red'
                        }
                    ],
                    publishDate: '2021-3-1 10:00:02',
                    modifyDate: '2021-3-1 17:20:24',
                    likeCount: 99,
                    pvCount: 923
                },
                {
                    key: 1,
                    name: '我的第二篇文章',
                    tags: [
                        {
                            name: 'JavaScript',
                            color: 'geekblue'
                        },
                        {
                            name: 'Vue',
                            color: 'blue'
                        },
                        {
                            name: 'React',
                            color: 'red'
                        }
                    ],
                    publishDate: '2021-3-1 10:00:02',
                    modifyDate: '2021-3-1 17:20:24',
                    likeCount: 99,
                    pvCount: 923
                },
                {
                    key: 2,
                    name: '这是测试用的',
                    tags: [
                        {
                            name: 'JavaScript',
                            color: 'geekblue'
                        },
                        {
                            name: 'React',
                            color: 'red'
                        }
                    ],
                    publishDate: '2021-3-1 10:00:02',
                    modifyDate: '2021-3-1 17:20:24',
                    likeCount: 45,
                    pvCount: 67
                },
                {
                    key: 3,
                    name: 'JavaScript测试用例',
                    tags: [
                        {
                            name: 'Vue',
                            color: 'blue'
                        },
                        {
                            name: 'React',
                            color: 'red'
                        }
                    ],
                    publishDate: '2021-3-1 10:00:02',
                    modifyDate: '2021-3-1 17:20:24',
                    likeCount: 959,
                    pvCount: 9213
                },
                {
                    key: 4,
                    name: 'Vue测试实例',
                    tags: [
                        {
                            name: 'React',
                            color: 'red'
                        }
                    ],
                    publishDate: '2021-3-1 10:00:02',
                    modifyDate: '2021-3-1 17:20:24',
                    likeCount: 45,
                    pvCount: 1234
                },
                {
                    key: 5,
                    name: '我的第一篇文章',
                    tags: [
                        {
                            name: 'JavaScript',
                            color: 'geekblue'
                        },

                        {
                            name: 'React',
                            color: 'red'
                        }
                    ],
                    publishDate: '2021-3-1 10:00:02',
                    modifyDate: '2021-3-1 17:20:24',
                    likeCount: 99,
                    pvCount: 923
                },
                {
                    key: 6,
                    name: '我的第一篇文章',
                    tags: [
                        {
                            name: 'JavaScript',
                            color: 'geekblue'
                        },
                        {
                            name: 'Vue',
                            color: 'blue'
                        },
                        {
                            name: 'React',
                            color: 'red'
                        }
                    ],
                    publishDate: '2021-3-1 10:00:02',
                    modifyDate: '2021-3-1 17:20:24',
                    likeCount: 99,
                    pvCount: 923
                },
                {
                    key: 7,
                    name: '我的第一篇文章',
                    tags: [
                        {
                            name: 'React',
                            color: 'red'
                        }
                    ],
                    publishDate: '2021-3-1 10:00:02',
                    modifyDate: '2021-3-1 17:20:24',
                    likeCount: 99,
                    pvCount: 923
                },
                {
                    key: 8,
                    name: '我的第一篇文章',
                    tags: [
                        {
                            name: 'JavaScript',
                            color: 'geekblue'
                        },
                        {
                            name: 'Vue',
                            color: 'blue'
                        },
                        {
                            name: 'React',
                            color: 'red'
                        }
                    ],
                    publishDate: '2021-3-1 10:00:02',
                    modifyDate: '2021-3-1 17:20:24',
                    likeCount: 9,
                    pvCount: 923
                },
                {
                    key: 9,
                    name: '我的第一篇文章',
                    tags: [
                        {
                            name: 'JavaScript',
                            color: 'geekblue'
                        },
                        {
                            name: 'Vue',
                            color: 'blue'
                        },
                        {
                            name: 'React',
                            color: 'red'
                        }
                    ],
                    publishDate: '2021-3-1 10:00:02',
                    modifyDate: '2021-3-1 17:20:24',
                    likeCount: 99,
                    pvCount: 923
                },
                {
                    key: 10,
                    name: '我的第一篇文章',
                    tags: [
                        {
                            name: 'JavaScript',
                            color: 'geekblue'
                        },
                        {
                            name: 'Vue',
                            color: 'blue'
                        },
                        {
                            name: 'React',
                            color: 'red'
                        }
                    ],
                    publishDate: '2021-3-1 10:00:02',
                    modifyDate: '2021-3-1 17:20:24',
                    likeCount: 99,
                    pvCount: 923
                }
            ]
        })

        const pagination = computed(() => ({
            total: state.articleSource.length,
            current: 1,
            pageSize: 10
        }))

        const search = () => {
            console.log(state.title, moment(state.date[0]).valueOf(), state.date[1])
        }

        const handleTableChange = pag => {
            console.log(pag)
        }
        // 删除文章
        const del = id => {
            console.log('删除文章', id)
        }

        // 编辑文章
        const modify = id => {
            console.log('编辑文章', id)
        }

        return {
            zhCN,
            ...toRefs(state),
            search,
            columns,
            pagination,
            handleTableChange,
            del,
            modify
        }
    },

    components: {
        PlusOutlined
    }
})
</script>

<style lang="less" scoped>
.article {
    .article-title {
        .article-title-search {
            .title-input {
                margin-right: 10px;
                width: 200px;
            }
            .title-range {
                width: 400px;
            }
        }
        .article-title-add {
            margin: 10px 0;
        }
    }
    .article-content {
        .article-image {
            width: 50px;
            height: 50px;
        }
        .modify {
            color: @link-color;
        }
        .del {
            color: @danger-color;
        }

        // 斑马纹
        .ant-table-striped :deep(.table-striped) {
            background-color: #fafafa;
        }
    }
}
</style>
