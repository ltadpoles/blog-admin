<template>
    <div class="article">
        <div class="article-title">
            <div class="article-title-search">
                <div class="search-sty">
                    <span>文章名称：</span>
                    <a-input class="title-input" v-model:value="title" placeholder="文章名称" />
                </div>
                <div class="search-sty">
                    <span>文章类型：</span>
                    <a-select v-model:value="type" class="title-input">
                        <a-select-option :value="0">全部</a-select-option>
                        <a-select-option :value="1">原创</a-select-option>
                        <a-select-option :value="2">转载</a-select-option>
                    </a-select>
                </div>
                <div class="search-sty">
                    <span>编辑时间：</span>
                    <a-range-picker
                        v-model:value="date"
                        :locale="zhCN"
                        class="title-input title-range"
                        :placeholder="placeholder"
                    />
                </div>
                <div><a-button type="primary" @click="search">查询</a-button></div>
            </div>
            <div class="article-title-add">
                <a-button type="primary" @click="add">
                    <template #icon><PlusOutlined /></template>添加文章
                </a-button>
                &nbsp;
                <a-button type="danger" :disabled="isAllDel" @click="delAll">批量删除</a-button>
            </div>
        </div>
        <div class="article-content">
            <a-table
                class="ant-table-striped"
                :columns="columns"
                :row-selection="rowSelection"
                :dataSource="articleSource"
                :pagination="pagination"
                :loading="loading"
                :rowClassName="(record, index) => (index % 2 === 1 ? 'table-striped' : null)"
                @change="handleTableChange"
            >
                <template #image="{ text: image }">
                    <img class="article-image" :src="image" alt="" />
                </template>
                <template #type="{ text: type }">
                    <span>
                        {{ type === 1 ? '原创' : '转载' }}
                    </span>
                </template>
                <template #tags="{ text: tags }">
                    <span>
                        <a-tag v-for="tag in tags" :key="tag" color="blue">
                            {{ tag.name }}
                        </a-tag>
                    </span>
                </template>
                <template #action="{ record }">
                    <span>
                        <span class="base" @click="modify(record.key)">修改</span>
                        <a-divider type="vertical" />
                        <a-popconfirm
                            title="确认删除这篇文章？"
                            ok-text="确认"
                            cancel-text="取消"
                            @confirm="del(record.key)"
                        >
                            <span class="base del">删除</span>
                        </a-popconfirm>
                    </span>
                </template>
            </a-table>
        </div>
    </div>
</template>

<script>
import { PlusOutlined, ExclamationCircleOutlined } from '@ant-design/icons-vue'
import { Modal } from 'ant-design-vue'
import { computed, createVNode, defineComponent, reactive, toRefs } from 'vue'
import { useRouter } from 'vue-router'

import zhCN from 'ant-design-vue/lib/locale-provider/zh_CN'
import moment from 'moment'
import 'moment/locale/zh-cn'

moment.locale('zh-cn')

const columns = [
    {
        title: '图片',
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
        title: '类型',
        dataIndex: 'type',
        slots: {
            customRender: 'type'
        }
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
        title: '浏览',
        dataIndex: 'pvCount'
    },
    {
        title: '点赞',
        dataIndex: 'likeCount'
    },
    {
        title: '操作',
        key: 'action',
        width: 110,
        align: 'center',
        slots: { customRender: 'action' }
    }
]

export default defineComponent({
    setup() {
        const router = useRouter()

        const state = reactive({
            title: '',
            type: 0,
            isAllDel: true,
            date: [],
            placeholder: ['开始时间', '结束时间'],
            loading: false,
            selectedRows: [],
            articleSource: [
                {
                    key: 0,
                    image: 'https://zos.alipayobjects.com/rmsportal/ODTLcjxAfvqbxHnVXCYX.png',
                    name: '我的第一篇文章',
                    type: 1,
                    tags: [
                        { id: 0, name: 'JavaScript' },
                        { id: 1, name: 'Vue' },
                        { id: 2, name: 'React' }
                    ],
                    publishDate: '2021-3-1 10:00:02',
                    modifyDate: '2021-3-1 17:20:24',
                    likeCount: 99,
                    pvCount: 923
                },
                {
                    key: 1,
                    name: '我的第二篇文章',
                    type: 2,
                    tags: [
                        { id: 0, name: 'JavaScript' },
                        { id: 1, name: 'Vue' }
                    ],
                    publishDate: '2021-3-1 10:00:02',
                    modifyDate: '2021-3-1 17:20:24',
                    likeCount: 99,
                    pvCount: 923
                },
                {
                    key: 2,
                    name: '这是测试用的',
                    type: 2,
                    tags: [
                        { id: 1, name: 'Vue' },
                        { id: 2, name: 'React' }
                    ],
                    publishDate: '2021-3-1 10:00:02',
                    modifyDate: '2021-3-1 17:20:24',
                    likeCount: 45,
                    pvCount: 67
                },
                {
                    key: 3,
                    name: 'JavaScript测试用例',
                    type: 2,
                    tags: [{ id: 0, name: 'JavaScript' }],
                    publishDate: '2021-3-1 10:00:02',
                    modifyDate: '2021-3-1 17:20:24',
                    likeCount: 959,
                    pvCount: 9213
                },
                {
                    key: 4,
                    name: 'Vue测试实例',
                    type: 2,
                    tags: [{ id: 1, name: 'Vue' }],
                    publishDate: '2021-3-1 10:00:02',
                    modifyDate: '2021-3-1 17:20:24',
                    likeCount: 45,
                    pvCount: 1234
                },
                {
                    key: 5,
                    name: '我的第一篇文章',
                    type: 1,
                    tags: [
                        { id: 0, name: 'JavaScript' },
                        { id: 1, name: 'Vue' }
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

        const rowSelection = {
            onChange: (selectedRowKeys, selectedRows) => {
                console.log(`selectedRowKeys: ${selectedRowKeys}`, 'selectedRows: ', selectedRows)
                state.selectedRows = selectedRows
                state.isAllDel = selectedRows.length < 1
            }
        }

        const search = () => {
            console.log(state.title, moment(state.date[0]).valueOf(), state.date[1])
        }

        const handleTableChange = pag => {
            console.log(pag)
        }

        const delAll = () => {
            Modal.confirm({
                title: '提示',
                icon: createVNode(ExclamationCircleOutlined),
                content: '确认删除所选文章?',
                cancelText: '取消',
                okText: '确认',
                center: true,
                onOk() {
                    return new Promise((resolve, reject) => {
                        setTimeout(Math.random() > 0.5 ? resolve : reject, 1000)
                    }).catch(() => console.log('Oops errors!'))
                },

                onCancel() {}
            })
            console.log(state.selectedRows)
        }

        const add = () => {
            router.push('article-publish')
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
            rowSelection,
            pagination,
            handleTableChange,
            delAll,
            add,
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
            display: flex;
            flex-wrap: wrap;
            .search-sty {
                margin-right: 10px;
                margin-bottom: 10px;
                .title-input {
                    width: 200px;
                }
                .title-range {
                    width: 360px;
                }
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
        .base {
            color: @link-color;
            cursor: pointer;
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
