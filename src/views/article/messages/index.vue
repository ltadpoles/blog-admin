<template>
  <div class="view-base">
    <div class="view-base-form">
      <el-form ref="formRef" :inline="true" :model="formData">
        <el-form-item label="留言内容" prop="content">
          <el-input v-model="formData.content" placeholder="请输入留言关键字" clearable />
        </el-form-item>
        <el-form-item label="留言时间" prop="date">
          <el-date-picker
            v-model="formData.date"
            type="daterange"
            start-placeholder="开始日期"
            end-placeholder="结束日期"
          />
        </el-form-item>
      </el-form>
      <div class="view-base-form-btn">
        <div class="view-base-form-btn-left">
          <el-button icon="Delete" type="danger" @click="delData">删除</el-button>
        </div>
        <div class="view-base-form-btn-right">
          <el-button icon="Refresh" @click="reset(formRef)">重置</el-button>
          <el-button type="primary" icon="Search" @click="search">搜索</el-button>
        </div>
      </div>
    </div>

    <div class="view-base-table">
      <el-table
        :data="tableData"
        border
        row-key="id"
        @selection-change="selectionChange"
        @expand-change="onExpandChange"
      >
        <el-table-column type="expand">
          <template #default="props">
            <div style="margin-bottom: 8px; display: flex; justify-content: space-between; align-items: center">
              <div></div>
              <el-button
                v-if="(childSelections[props.row.id] || []).length > 0"
                size="small"
                type="danger"
                icon="Delete"
                @click="delChildren(props.row)"
              >
                删除所选子留言
              </el-button>
            </div>
            <el-table
              :data="childrenMap[props.row.id] || []"
              size="small"
              v-loading="!!loadingChildren[props.row.id]"
              @selection-change="sels => childSelectionChange(props.row.id, sels)"
              row-key="id"
            >
              <el-table-column type="selection" width="45" />
              <el-table-column prop="content" label="留言内容" />
              <el-table-column label="头像" width="70" align="center">
                <template #default="scope">
                  <el-avatar :size="24" :src="scope.row.user?.avatar" />
                </template>
              </el-table-column>
              <el-table-column label="回复人" width="120">
                <template #default="scope">{{ scope.row.user?.name || '-' }}</template>
              </el-table-column>
              <el-table-column prop="replyToUserName" label="回复对象" width="120" />
              <el-table-column prop="ipAddress" label="IP" width="160" />
              <el-table-column prop="region" label="地区" width="160" />
              <el-table-column prop="likeCount" label="点赞" width="90" align="center">
                <template #default="scope">{{ scope.row.likeCount ?? 0 }}</template>
              </el-table-column>
              <el-table-column prop="createTime" label="留言时间" width="180">
                <template #default="scope">
                  {{ dayjs(scope.row.createTime).format('YYYY-MM-DD HH:mm') }}
                </template>
              </el-table-column>
              <el-table-column label="操作" width="100" align="center">
                <template #default="scope">
                  <el-popconfirm
                    confirm-button-text="确认"
                    cancel-button-text="取消"
                    icon="InfoFilled"
                    title="确认删除?"
                    @confirm="delChild(scope.row, props.row)"
                  >
                    <template #reference>
                      <el-button link type="danger" icon="Delete" />
                    </template>
                  </el-popconfirm>
                </template>
              </el-table-column>
            </el-table>
          </template>
        </el-table-column>
        <el-table-column type="selection" width="45" />
        <el-table-column prop="content" label="留言内容" />
        <el-table-column label="头像" width="70" align="center">
          <template #default="scope">
            <el-avatar :size="24" :src="scope.row.user?.avatar" />
          </template>
        </el-table-column>
        <el-table-column label="回复人" width="120">
          <template #default="scope">{{ scope.row.user?.name || '-' }}</template>
        </el-table-column>
        <el-table-column prop="replyToUserName" label="回复对象" width="120" />
        <el-table-column prop="ipAddress" label="IP" width="160" />
        <el-table-column prop="region" label="地区" width="160" />
        <el-table-column prop="likeCount" label="点赞" width="90" align="center">
          <template #default="scope">{{ scope.row.likeCount ?? 0 }}</template>
        </el-table-column>
        <el-table-column prop="createTime" label="留言时间" width="180">
          <template #default="scope">
            {{ dayjs(scope.row.createTime).format('YYYY-MM-DD HH:mm') }}
          </template>
        </el-table-column>
        <el-table-column label="操作" width="100" align="center">
          <template #default="scope">
            <el-popconfirm
              confirm-button-text="确认"
              cancel-button-text="取消"
              icon="InfoFilled"
              title="确认删除?"
              @confirm="delConfirm(scope.row)"
            >
              <template #reference>
                <el-button link type="danger" icon="Delete" />
              </template>
            </el-popconfirm>
          </template>
        </el-table-column>
      </el-table>
    </div>

    <div class="view-base-pagination">
      <el-pagination
        v-model:current-page="pageQuery.currentPage"
        v-model:page-size="query.pageSize"
        size="small"
        layout="total, prev, pager, next"
        :total="pageQuery.total"
        @current-change="currentChange"
      />
    </div>
  </div>
</template>

<script setup>
import { ElMessage } from 'element-plus'
import { reactive, ref, useTemplateRef, onMounted } from 'vue'
import { dayjs } from 'element-plus'
import { ElMessageBox } from 'element-plus'
import * as messageApi from '@/api/message'

const formRef = useTemplateRef('formRef')
const formData = reactive({
  content: '',
  date: ''
})

const tableData = ref([])
const childrenMap = reactive({})
const loadingChildren = reactive({})
const childSelections = reactive({})
const query = reactive({
  pageNum: 1,
  pageSize: 10,
  param: {}
})
const pageQuery = reactive({
  total: 0,
  currentPage: 1
})

const loading = ref(false)
const getList = async () => {
  try {
    loading.value = true
    const { data } = await messageApi.page(query)
    // 兼容后端返回格式：{ data: { records,total } } 或 { data: { list,total } }
    const payload = data?.data || data
    tableData.value = payload?.records || payload?.list || []
    pageQuery.total = payload?.total || 0
  } catch {
    ElMessage.error('获取数据失败')
  } finally {
    loading.value = false
  }
}
const currentChange = page => {
  query.pageNum = page
  getList(query)
}

const search = () => {
  pageQuery.currentPage = 1
  query.pageNum = 1
  const params = { ...formData }
  if (Array.isArray(formData.date) && formData.date.length === 2) {
    params.startTime = formData.date[0]
    params.endTime = formData.date[1]
  }
  delete params.date
  query.param = params
  getList(query)
}
const reset = formEl => {
  if (!formEl) {
    return
  }
  formEl.resetFields()
  pageQuery.currentPage = 1
  query.param = {}
  getList(query)
}

const delData = () => {
  if (multipleSelection.value.length === 0) {
    return ElMessage.error('请至少选择一条数据')
  }

  ElMessageBox.confirm('确认删除选中留言？', '提示', {
    confirmButtonText: '确认',
    cancelButtonText: '取消',
    type: 'warning'
  }).then(async () => {
    const ids = multipleSelection.value.map(i => i.id).join(',')
    await messageApi.del({ ids })
    ElMessage.success('删除成功')
    getList(query)
  })
}

const delConfirm = async row => {
  await messageApi.del({ ids: row.id })
  ElMessage.success('删除成功')
  getList(query)
}

// 子留言单条删除
const delChild = async (childRow, parentRow) => {
  await messageApi.del({ ids: childRow.id })
  ElMessage.success('删除成功')
  // 仅刷新该父行的子列表
  childrenMap[parentRow.id] = undefined
  onExpandChange(parentRow, true)
}

const multipleSelection = ref([])
const selectionChange = val => {
  multipleSelection.value = val
}

// 子表多选收集
const childSelectionChange = (parentId, sels) => {
  childSelections[parentId] = sels
}

// 批量删除子留言
const delChildren = async row => {
  const sels = childSelections[row.id] || []
  if (sels.length === 0) {
    return ElMessage.error('请至少选择一条子留言')
  }
  await ElMessageBox.confirm('确认删除选中子留言？', '提示', {
    confirmButtonText: '确认',
    cancelButtonText: '取消',
    type: 'warning'
  })
  const ids = sels.map(i => i.id).join(',')
  await messageApi.del({ ids })
  ElMessage.success('删除成功')
  // 重新拉取该父留言的子列表
  childrenMap[row.id] = undefined
  onExpandChange(row, true)
}

// 懒加载子留言：在行展开时触发
const onExpandChange = async (row, expanded) => {
  if (!expanded) {
    return
  }
  if (childrenMap[row.id]) {
    return
  }
  loadingChildren[row.id] = true
  try {
    const { data } = await messageApi.children({ parentId: row.id })
    const list = data?.data?.list || data?.data || data || []
    childrenMap[row.id] = list
  } finally {
    loadingChildren[row.id] = false
  }
}

onMounted(() => {
  getList(query)
})
</script>

<style lang="scss" scoped>
@use './index.scss' as *;
</style>
