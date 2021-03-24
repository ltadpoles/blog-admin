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
                :row-selection="rowSelection"
                :dataSource="articleSource"
                :pagination="false"
                :loading="loading"
                :rowClassName="(record, index) => (index % 2 === 1 ? 'table-striped' : null)"
                @change="handleTableChange"
            >
                <a-table-column
                    key="title"
                    title="标题"
                    data-index="title"
                    :width="160"
                    :ellipsis="true"
                >
                    <template #default="{ record }">
                        <router-link :to="{ path: '/article-info', query: { id: record.id } }">{{
                            record.title
                        }}</router-link>
                    </template>
                </a-table-column>
                <a-table-column key="user" title="作者" :ellipsis="true">
                    <template #default="{ record }">
                        <span>
                            {{ record.user.nick_name }}
                        </span>
                    </template>
                </a-table-column>
                <a-table-column key="type" title="类型">
                    <template #default="{ record }">
                        <span>
                            {{ record.type === 1 ? '原创' : '转载' }}
                        </span>
                    </template>
                </a-table-column>
                <a-table-column key="tag" title="标签">
                    <template #default="{ record }">
                        <div>
                            <a-tag v-for="item in record.tag" :key="item.id" color="blue">
                                {{ item.name }}
                            </a-tag>
                        </div>
                    </template>
                </a-table-column>
                <a-table-column key="publish_time" title="发布时间" data-index="publish_time" />
                <a-table-column key="change_time" title="修改时间" data-index="change_time" />
                <a-table-column key="pv" title="浏览" data-index="pv" align="center" />
                <a-table-column title="点赞" data-index="like" align="center" />
                <a-table-column key="action" title="操作" align="center" :width="100">
                    <template #default="{ record }">
                        <div v-if="getState(record.userId)">
                            <span class="base" @click="modify(record.id)"><FormOutlined /></span>
                            <a-divider type="vertical" />
                            <a-popconfirm
                                title="确认删除这篇文章？"
                                ok-text="确认"
                                cancel-text="取消"
                                @confirm="del(record.id)"
                            >
                                <span class="base del"><DeleteOutlined /></span>
                            </a-popconfirm>
                        </div>
                        <div v-else>-</div>
                    </template>
                </a-table-column>
            </a-table>

            <div class="pagination">
                <a-pagination
                    :current="pagination.page"
                    :pageSize="pagination.pageSize"
                    :total="pagination.total"
                    :show-total="total => `共 ${total} 条`"
                    @change="handleTableChange"
                />
            </div>
        </div>
    </div>
</template>

<script>
import {
    PlusOutlined,
    ExclamationCircleOutlined,
    FormOutlined,
    DeleteOutlined
} from '@ant-design/icons-vue'
import { message, Modal } from 'ant-design-vue'
import { createVNode, defineComponent, onMounted, reactive, toRefs } from 'vue'
import { useRouter } from 'vue-router'
import { getList, delArticle } from '@/api/article'
import { getState } from '@/utils'

import zhCN from 'ant-design-vue/lib/locale-provider/zh_CN'
import moment from 'moment'
import 'moment/locale/zh-cn'

moment.locale('zh-cn')

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
            articleSource: []
        })

        const pagination = reactive({
            page: 1,
            pageSize: 10,
            total: 0
        })

        const rowSelection = {
            onChange: (selectedRowKeys, selectedRows) => {
                state.selectedRows = selectedRows
                state.isAllDel = selectedRows.length < 1
            },
            getCheckboxProps: record => ({
                disabled: !getState(record.userId)
            })
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
            pagination.page = 1
            const { page, pageSize } = pagination
            getArtList({ page, pageSize, params: getParams() })
        }

        const handleTableChange = pag => {
            pagination.page = pag
            const { page, pageSize } = pagination
            getArtList({ page, pageSize, params: getParams() })
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
                        search()
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
                search()
            })
        }

        // 编辑文章
        const modify = id => {
            console.log('编辑文章', id)
            router.push({ path: '/article-publish', query: { id } })
        }

        const getArtList = query => {
            state.loading = true
            getList(query)
                .then(res => {
                    res.data.rows.forEach(item => {
                        item.key = item.id
                        item.publish_time = moment(item.publish_time).format('YYYY-MM-DD HH:mm')
                        item.change_time = moment(item.change_time).format('YYYY-MM-DD HH:mm')
                    })
                    state.articleSource = res.data.rows
                    pagination.total = res.data.count
                    state.selectedRows = []
                    state.isAllDel = true
                    state.loading = false
                })
                .catch(() => {
                    state.loading = false
                })
        }

        onMounted(() => {
            const { page, pageSize } = pagination
            getArtList({ page, pageSize })
        })

        return {
            zhCN,
            ...toRefs(state),
            getState,
            search,
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
        PlusOutlined,
        FormOutlined,
        DeleteOutlined
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

        .pagination {
            text-align: right;
            margin-top: 15px;
        }

        // 斑马纹
        .ant-table-striped :deep(.table-striped) {
            background-color: #fafafa;
        }
    }
}
</style>
