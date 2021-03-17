<template>
    <div class="tag">
        <div class="tag-title">
            <div class="tag-title-search">
                <div class="search-sty">
                    <span>标签名称：</span>
                    <a-input class="title-input" v-model:value="title" placeholder="标签名称" />
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

        <div class="article-content">
            <a-table
                class="ant-table-striped"
                :columns="columns"
                :row-selection="rowSelection"
                :dataSource="tagSource"
                :pagination="pagination"
                :loading="loading"
                :rowClassName="(record, index) => (index % 2 === 1 ? 'table-striped' : null)"
                @change="handleTableChange"
            >
                <template #image="{ text: image }">
                    <img class="article-image" :src="image" alt="" />
                </template>
                <template #user="{ text: user }">
                    <span>
                        {{ user.nickName }}
                    </span>
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
import { defineComponent, reactive, toRefs, computed } from 'vue'
import { PlusOutlined } from '@ant-design/icons-vue'

const columns = [
    {
        name: '标签名称',
        dataIndex: 'name'
    },
    {
        title: '描述',
        dataIndex: 'dec'
    },
    {
        title: '创建时间',
        dataIndex: 'create_time'
    },
    {
        title: '使用次数',
        dataIndex: 'use_count'
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
        const state = reactive({
            title: '',
            isAllDel: '',
            selectedRows: [],
            tagSource: [],
            count: 0,
            loading: false
        })
        const search = () => {}
        const add = () => {}
        const delAll = () => {}

        const rowSelection = {
            onChange: (selectedRowKeys, selectedRows) => {
                state.selectedRows = selectedRows
                state.isAllDel = selectedRows.length < 1
            }
        }

        const pagination = computed(() => ({
            current: 1,
            pageSize: 10,
            total: state.count,
            showTotal: total => {
                return `共 ${total} 条`
            }
        }))

        const handleTableChange = pag => {
            const { current, pageSize } = pag
        }

        return {
            ...toRefs(state),
            search,
            add,
            delAll,
            columns,
            rowSelection,
            pagination,
            handleTableChange
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
        .tag-image {
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
