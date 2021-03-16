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
                    <span>发布时间：</span>
                    <a-range-picker
                        v-model:value="pubDate"
                        :locale="zhCN"
                        class="title-input title-range"
                        :placeholder="placeholder"
                    />
                </div>
                <div class="search-sty">
                    <span>编辑时间：</span>
                    <a-range-picker
                        v-model:value="changeDate"
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
                <template #tag="{ text: tag }">
                    <span>
                        <a-tag v-for="item in tag" :key="item.id" color="blue">
                            {{ item.name }}
                        </a-tag>
                    </span>
                </template>
                <template #action="{ record }">
                    <span>
                        <span class="base" @click="modify(record.id)">修改</span>
                        <a-divider type="vertical" />
                        <a-popconfirm
                            title="确认删除这篇文章？"
                            ok-text="确认"
                            cancel-text="取消"
                            @confirm="del(record.id)"
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
import { message, Modal } from 'ant-design-vue'
import { computed, createVNode, defineComponent, onMounted, reactive, toRefs } from 'vue'
import { useRouter } from 'vue-router'
import { getList, delArticle } from '@/api/article'

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
        dataIndex: 'title'
    },
    {
        title: '作者',
        dataIndex: 'author'
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
        dataIndex: 'tag',
        slots: {
            customRender: 'tag'
        }
    },
    {
        title: '发布时间',
        dataIndex: 'publish_time'
    },
    {
        title: '修改时间',
        dataIndex: 'change_time'
    },
    {
        title: '浏览',
        dataIndex: 'pv'
    },
    {
        title: '点赞',
        dataIndex: 'like'
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
            pubDate: [],
            changeDate: [],
            placeholder: ['开始时间', '结束时间'],
            loading: false,
            selectedRows: [],
            articleSource: [],
            count: 0
        })

        const pagination = computed(() => ({
            current: 1,
            pageSize: 10,
            total: state.count,
            showTotal: total => {
                return `共 ${total} 条`
            }
        }))

        const rowSelection = {
            onChange: (selectedRowKeys, selectedRows) => {
                state.selectedRows = selectedRows
                state.isAllDel = selectedRows.length < 1
            }
        }

        const getParams = () => {
            return {
                title: state.title,
                type: state.type,
                // 选择的当天0点时间戳和23：59时间戳
                publish_time: state.pubDate.length
                    ? [
                          moment(state.pubDate[0])
                              .startOf('day')
                              .format('x'),
                          moment(state.pubDate[1])
                              .endOf('day')
                              .format('x')
                      ]
                    : null,
                change_time: state.changeDate.length
                    ? [
                          moment(state.changeDate[0])
                              .startOf('day')
                              .format('x'),
                          moment(state.changeDate[1])
                              .endOf('day')
                              .format('x')
                      ]
                    : null
            }
        }

        const search = () => {
            pagination.value.current = 1
            const { current, pageSize } = pagination.value
            getArtList(Object.assign({ page: current, pageSize }, { params: getParams() }))
        }

        const handleTableChange = pag => {
            const { current, pageSize } = pag
            getArtList(Object.assign({ page: current, pageSize }, { params: getParams() }))
        }

        // 批量删除
        const delAll = () => {
            Modal.confirm({
                title: '提示',
                icon: createVNode(ExclamationCircleOutlined),
                content: '确认删除所选文章?',
                cancelText: '取消',
                okText: '确认',
                center: true,
                onOk() {
                    let id = state.selectedRows.map(item => item.id).join(',')
                    delArticle(id).then(res => {
                        message.success(res.message)
                        const { current, pageSize } = pagination.value
                        getArtList(
                            Object.assign({ page: current, pageSize }, { params: getParams() })
                        )
                    })
                },

                onCancel() {}
            })
        }

        const add = () => {
            router.push('article-publish')
        }

        // 删除文章
        const del = id => {
            delArticle(id).then(res => {
                message.success(res.message)
                const { current, pageSize } = pagination.value
                getArtList(Object.assign({ page: current, pageSize }, { params: getParams() }))
            })
        }

        // 编辑文章
        const modify = id => {
            console.log('编辑文章', id)
        }

        const getArtList = query => {
            getList(query).then(res => {
                res.data.rows.forEach(item => {
                    item.key = item.id
                    item.publish_time = moment(item.publish_time).format('YYYY-MM-DD HH:mm')
                    item.change_time = moment(item.change_time).format('YYYY-MM-DD HH:mm')
                })
                state.articleSource = res.data.rows
                state.count = res.data.count
                state.selectedRows = []
                state.isAllDel = true
            })
        }

        onMounted(() => {
            const { current, pageSize } = pagination.value
            getArtList({ page: current, pageSize })
        })

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
