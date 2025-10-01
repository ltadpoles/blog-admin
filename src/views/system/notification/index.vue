<template>
  <div class="view-base">
    <div class="view-base-form">
      <el-form ref="formRef" :inline="true" :model="formData">
        <el-form-item label="通知类型" prop="type">
          <el-select v-model="formData.type" placeholder="请选择通知类型" clearable>
            <el-option label="评论" value="comment" />
            <el-option label="留言" value="board" />
            <el-option label="回复" value="reply" />
            <el-option label="点赞" value="like" />
            <el-option label="系统" value="system" />
          </el-select>
        </el-form-item>
        <el-form-item label="阅读状态" prop="isRead">
          <el-select v-model="formData.isRead" placeholder="请选择阅读状态" clearable>
            <el-option label="未读" value="0" />
            <el-option label="已读" value="1" />
          </el-select>
        </el-form-item>
        <el-form-item label="通知时间" prop="date">
          <el-date-picker
            v-model="formData.date"
            type="daterange"
            value-format="x"
            start-placeholder="开始日期"
            end-placeholder="结束日期"
          />
        </el-form-item>
      </el-form>
      <div class="view-base-form-btn">
        <div class="view-base-form-btn-left">
          <el-button icon="Delete" type="danger" @click="delData">删除</el-button>
          <el-button icon="View" type="success" @click="markAsReadData">标记已读</el-button>
          <el-button icon="Check" type="primary" @click="markAllAsReadData">全部已读</el-button>
          <el-button icon="Delete" type="warning" @click="clearReadData">清空已读</el-button>
        </div>
        <div class="view-base-form-btn-right">
          <el-button icon="Refresh" @click="reset(formRef)">重置</el-button>
          <el-button type="primary" icon="Search" @click="search">搜索</el-button>
        </div>
      </div>
    </div>

    <div class="view-base-table">
      <el-table :data="tableData" border v-loading="loading" @selection-change="selectionChange">
        <el-table-column type="selection" width="55" />
        <el-table-column prop="type" label="通知类型" width="100" align="center">
          <template #default="scope">
            <el-tag v-if="scope.row.type === 'comment'" type="primary">评论</el-tag>
            <el-tag v-else-if="scope.row.type === 'board'" type="success">留言</el-tag>
            <el-tag v-else-if="scope.row.type === 'reply'" type="info">回复</el-tag>
            <el-tag v-else-if="scope.row.type === 'like'" type="warning">点赞</el-tag>
            <el-tag v-else-if="scope.row.type === 'system'" type="danger">系统</el-tag>
            <el-tag v-else>未知</el-tag>
          </template>
        </el-table-column>
        <el-table-column prop="title" label="通知标题" min-width="200" show-overflow-tooltip />
        <el-table-column prop="content" label="通知内容" min-width="250" show-overflow-tooltip />
        <el-table-column label="接收用户" width="120">
          <template #default="scope">{{ scope.row.user?.name || '-' }}</template>
        </el-table-column>
        <el-table-column label="触发用户" width="120">
          <template #default="scope">{{ scope.row.fromUser?.name || '-' }}</template>
        </el-table-column>
        <el-table-column prop="articleTitle" label="关联文章" min-width="180" show-overflow-tooltip>
          <template #default="scope">{{ scope.row.articleTitle || '-' }}</template>
        </el-table-column>
        <el-table-column prop="isRead" label="阅读状态" width="100" align="center">
          <template #default="scope">
            <el-tag v-if="scope.row.isRead === '0'" type="warning">未读</el-tag>
            <el-tag v-else-if="scope.row.isRead === '1'" type="success">已读</el-tag>
            <el-tag v-else type="info">未知</el-tag>
          </template>
        </el-table-column>
        <el-table-column prop="createTime" label="通知时间" width="180">
          <template #default="scope">
            {{ dayjs(scope.row.createTime).format('YYYY-MM-DD HH:mm:ss') }}
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
import { reactive, ref } from 'vue'
import { ElMessage, ElMessageBox, dayjs } from 'element-plus'
import * as notificationApi from '@/api/notification'

const formRef = ref()
const formData = reactive({
  type: '',
  isRead: '',
  date: []
})

const tableData = ref([])
const multipleSelection = ref([])
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
    // 使用管理员的adminPage接口
    const { data } = await notificationApi.adminPage(query)
    const payload = data?.data || data
    tableData.value = payload?.records || payload?.list || []
    pageQuery.total = payload?.total || 0
  } finally {
    loading.value = false
  }
}

const currentChange = page => {
  query.pageNum = page
  getList()
}

const selectionChange = val => {
  multipleSelection.value = val
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
  getList()
}

const reset = formEl => {
  if (!formEl) {
    return
  }
  formEl.resetFields()
  pageQuery.currentPage = 1
  query.pageNum = 1
  query.param = {}
  getList()
}

const delData = () => {
  if (multipleSelection.value.length === 0) {
    return ElMessage.error('请至少选择一条数据')
  }
  const ids = multipleSelection.value.map(i => i.id)
  ElMessageBox.confirm(`确认删除选中的${ids.length}条通知？`, '提示', {
    confirmButtonText: '确定',
    cancelButtonText: '取消',
    type: 'warning'
  }).then(async () => {
    await notificationApi.del({ ids })
    ElMessage.success('删除成功')
    getList()
  })
}

const markAsReadData = () => {
  if (multipleSelection.value.length === 0) {
    return ElMessage.error('请至少选择一条数据')
  }
  const ids = multipleSelection.value.map(i => i.id)
  ElMessageBox.confirm(`确认标记选中的${ids.length}条通知为已读？`, '提示', {
    confirmButtonText: '确定',
    cancelButtonText: '取消',
    type: 'info'
  }).then(async () => {
    await notificationApi.markAsRead({ ids })
    ElMessage.success('标记成功')
    getList()
  })
}

const markAllAsReadData = () => {
  ElMessageBox.confirm('确认将所有未读通知标记为已读？', '提示', {
    confirmButtonText: '确定',
    cancelButtonText: '取消',
    type: 'warning'
  }).then(async () => {
    await notificationApi.markAllAsRead()
    ElMessage.success('全部已读成功')
    getList()
  })
}

const clearReadData = () => {
  ElMessageBox.confirm('确认清空所有已读通知？', '提示', {
    confirmButtonText: '确定',
    cancelButtonText: '取消',
    type: 'warning'
  }).then(async () => {
    await notificationApi.clearRead()
    ElMessage.success('清空成功')
    getList()
  })
}

getList()
</script>

<style lang="scss" scoped>
@use './index.scss' as *;
</style>
