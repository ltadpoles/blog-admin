<template>
    <div class="tag">
        <div class="tag-title">
            <div class="tag-title-search">
                <div class="search-sty">
                    <span>标签名称：</span>
                    <a-input class="title-input" v-model:value="name" placeholder="标签名称" />
                </div>
                <div><a-button type="primary" @click="search">查询</a-button></div>
            </div>
            <div class="tag-title-add">
                <a-button type="primary" @click="add">
                    <template #icon><PlusOutlined /></template>添加标签
                </a-button>
                &nbsp;
                <a-button type="danger" :disabled="isAllDel" @click="delAll">批量删除</a-button>
            </div>
        </div>

        <div class="tag-content">
            <a-table
                class="ant-table-striped"
                :columns="columns"
                :row-selection="rowSelection"
                :dataSource="tagSource"
                :pagination="false"
                :loading="loading"
                :rowClassName="(record, index) => (index % 2 === 1 ? 'table-striped' : null)"
            >
                <template #create_time="{ text: create_time }">
                    <span>
                        {{ moment(create_time).format('YYYY-MM-DD') }}
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

        <!-- 新增标签 -->
        <a-modal
            v-model:visible="tagVisible"
            title="创建标签"
            @ok="tagAdd"
            @cancel="tagCancel"
            class="tag-modal"
            okText="确认"
            cancelText="取消"
        >
            <div class="tag-modal-input">
                <p>标签名：</p>
                <a-input
                    placeholder="标签名(10个字符以内,不支持特殊字符)"
                    v-model:value="newTags.name"
                ></a-input>
            </div>
            <div class="tag-modal-input">
                <p>标签描述：</p>
                <a-input placeholder="标签描述(可选)" v-model:value="newTags.dec"></a-input>
            </div>
        </a-modal>
    </div>
</template>

<script>
import { defineComponent, reactive, toRefs, onMounted } from 'vue'
import { PlusOutlined } from '@ant-design/icons-vue'
import { addTag as addTags, getTags } from '@/api/tag'
import { message } from 'ant-design-vue'
import moment from 'moment'

const columns = [
    {
        title: '标签名称',
        dataIndex: 'name'
    },
    {
        title: '描述',
        dataIndex: 'dec'
    },
    {
        title: '创建时间',
        dataIndex: 'create_time',
        slots: {
            customRender: 'create_time'
        }
    },
    {
        title: '使用次数',
        dataIndex: 'count'
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
        const userId = JSON.parse(localStorage.getItem('info')).id
        const state = reactive({
            name: '',
            isAllDel: '',
            selectedRows: [],
            tagSource: [],
            loading: false,
            tagVisible: false
        })
        const search = () => {
            pagination.page = 1
            const { page, pageSize } = pagination
            getList({ page, pageSize, params: { name: state.name } })
        }
        const add = () => {
            state.tagVisible = true
        }
        const delAll = () => {}

        const rowSelection = {
            onChange: (selectedRowKeys, selectedRows) => {
                state.selectedRows = selectedRows
                state.isAllDel = selectedRows.length < 1
            }
        }

        const pagination = reactive({
            page: 1,
            pageSize: 10,
            total: 0
        })

        const newTags = reactive({
            name: '',
            dec: ''
        })

        const handleTableChange = current => {
            pagination.page = current
            const { page, pageSize } = pagination
            getList({ page, pageSize, params: { name: state.name } })
        }

        const getList = params => {
            state.loading = true
            getTags(params)
                .then(data => {
                    data.data.rows.forEach(item => {
                        item.key = item.id
                    })
                    state.loading = false
                    state.tagSource = data.data.rows
                    pagination.total = data.data.count
                })
                .catch(() => {
                    state.loading = false
                })
        }

        const tagAdd = () => {
            const pattern = new RegExp(
                "[`~!@#$^&*()=|{}':;',\\[\\].<>/?~！@#￥……&*（）——|{}【】‘；：”“'。，、？]"
            )
            if (!newTags.name || !newTags.dec) {
                message.warning('请完善标签信息')
                return
            }
            if (pattern.test(newTags.name)) {
                message.warning('标签不能包含特殊字符')
                return
            }
            if (newTags.name.length > 10) {
                message.warning('标签长度不合法')
                return
            }
            addTags({ ...newTags, userId }).then(res => {
                message.success(res.message)
                tagCancel()
                search()
            })
        }

        const tagCancel = () => {
            newTags.name = ''
            newTags.dec = ''
            state.tagVisible = false
        }

        onMounted(() => {
            const { page, pageSize } = pagination
            getList({ page, pageSize })
        })

        return {
            ...toRefs(state),
            newTags,
            moment,
            search,
            add,
            delAll,
            columns,
            rowSelection,
            pagination,
            handleTableChange,
            tagAdd,
            tagCancel
        }
    },
    components: { PlusOutlined }
})
</script>

<style lang="less" scoped>
.tag {
    .tag-title {
        .tag-title-search {
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
        .tag-title-add {
            margin: 10px 0;
        }
    }
    .tag-content {
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
