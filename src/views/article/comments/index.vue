<template>
  <div class="view-base">
    <div class="view-base-form">
      <el-form ref="formRef" :inline="true" :model="formData">
        <el-form-item label="评论内容" prop="content">
          <el-input v-model="formData.content" placeholder="请输入评论关键字" clearable />
        </el-form-item>
        <el-form-item label="评论时间" prop="date">
          <el-date-picker
            v-model="formData.date"
            type="daterange"
            value-format="x"
            start-placeholder="开始日期"
            end-placeholder="结束日期"
          />
        </el-form-item>
        <el-form-item label="审核状态" prop="auditStatus">
          <el-select v-model="formData.auditStatus" placeholder="请选择审核状态" clearable>
            <el-option label="待审核" value="0" />
            <el-option label="审核通过" value="1" />
            <el-option label="审核拒绝" value="2" />
          </el-select>
        </el-form-item>
      </el-form>
      <div class="view-base-form-btn">
        <div class="view-base-form-btn-left">
          <el-button icon="Delete" type="danger" @click="delData">删除</el-button>
          <el-button icon="Check" type="success" @click="auditData('1')">审核通过</el-button>
          <el-button icon="Close" type="warning" @click="auditData('0')">审核拒绝</el-button>
        </div>
        <div class="view-base-form-btn-right">
          <el-button icon="Refresh" @click="reset(formRef)">重置</el-button>
          <el-button type="primary" icon="Search" @click="search">搜索</el-button>
        </div>
      </div>
    </div>

    <div class="view-base-table">
      <el-table :data="tableData" border row-key="id" @selection-change="selectionChange">
        <el-table-column type="selection" width="45" />
        <el-table-column prop="content" label="评论内容" />
        <el-table-column label="头像" width="70" align="center">
          <template #default="scope">
            <el-avatar :size="24" :src="scope.row.user?.avatar" />
          </template>
        </el-table-column>
        <el-table-column label="评论人" width="120">
          <template #default="scope">{{ scope.row.user?.name || '-' }}</template>
        </el-table-column>
        <el-table-column prop="article.title" label="所属文章" width="220">
          <template #default="scope">{{ scope.row.article?.title || '-' }}</template>
        </el-table-column>
        <el-table-column prop="replyToUserName" label="回复对象" width="120">
          <template #default="scope">{{ scope.row.replyToUserName || '-' }}</template>
        </el-table-column>
        <el-table-column prop="ipAddress" label="IP" width="160" />
        <el-table-column prop="region" label="地区" width="160" />
        <el-table-column prop="top" label="是否置顶" width="100" align="center">
          <template #default="scope">
            <el-tag v-if="scope.row.parentId === 0 && scope.row.top === '1'" type="primary">是</el-tag>
            <el-tag v-else-if="scope.row.parentId === 0" type="info">否</el-tag>
            <span v-else>-</span>
          </template>
        </el-table-column>
        <el-table-column prop="likeCount" label="点赞" width="90" align="center">
          <template #default="scope">{{ scope.row.likeCount ?? 0 }}</template>
        </el-table-column>
        <el-table-column prop="auditStatus" label="审核状态" width="100" align="center">
          <template #default="scope">
            <el-tag v-if="scope.row.auditStatus === '0'" type="warning">待审核</el-tag>
            <el-tag v-else-if="scope.row.auditStatus === '1'" type="success">审核通过</el-tag>
            <el-tag v-else-if="scope.row.auditStatus === '2'" type="danger">审核拒绝</el-tag>
            <el-tag v-else type="info">未知</el-tag>
          </template>
        </el-table-column>
        <el-table-column prop="createTime" label="评论时间" width="180">
          <template #default="scope">
            {{ dayjs(scope.row.createTime).format('YYYY-MM-DD HH:mm') }}
          </template>
        </el-table-column>
        <el-table-column label="操作" width="160" align="center">
          <template #default="scope">
            <el-button link type="primary" icon="ChatLineSquare" @click="replyComment(scope.row)" />
            <el-tooltip v-if="scope.row.parentId === 0 && scope.row.top === '1'" content="取消置顶" placement="top">
              <el-button link type="warning" size="small" icon="Bottom" @click="toggleTop(scope.row, '0')" />
            </el-tooltip>
            <el-tooltip v-else-if="scope.row.parentId === 0" content="置顶" placement="top">
              <el-button link type="primary" size="small" icon="Top" @click="toggleTop(scope.row, '1')" />
            </el-tooltip>
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
    <comment-reply-dialog
      :isShow="commentReplyInfo.isShow"
      :title="commentReplyInfo.title"
      :info="commentReplyInfo.info"
      @close="commentReplyClose"
    />
  </div>
</template>

<script setup>
import { ElMessage } from 'element-plus'
import { reactive, ref, useTemplateRef, onMounted } from 'vue'
import { dayjs } from 'element-plus'
import { ElMessageBox } from 'element-plus'
import * as commentApi from '@/api/comment'
import commentReplyDialog from '../components/comment-reply/index.vue'

const formRef = useTemplateRef('formRef')
const formData = reactive({
  content: '',
  date: '',
  auditStatus: ''
})

const tableData = ref([])
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
    const { data } = await commentApi.page(query)
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
    params.createTimeStart = formData.date[0]
    params.createTimeEnd = formData.date[1]
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

  ElMessageBox.confirm('确认删除选中评论？', '提示', {
    confirmButtonText: '确认',
    cancelButtonText: '取消',
    type: 'warning'
  }).then(async () => {
    const ids = multipleSelection.value.map(i => i.id).join(',')
    await commentApi.del({ ids })
    ElMessage.success('删除成功')
    getList(query)
  })
}

const auditData = type => {
  if (multipleSelection.value.length === 0) {
    return ElMessage.error('请至少选择一条数据')
  }

  const selectedIds = multipleSelection.value.map(i => i.id)
  const actionText = type === '1' ? '审核通过' : '审核拒绝'
  const confirmText = `确认${actionText}选中的${selectedIds.length}条评论？`

  ElMessageBox.confirm(confirmText, '提示', {
    confirmButtonText: '确认',
    cancelButtonText: '取消',
    type: 'warning'
  }).then(async () => {
    await commentApi.audit({ ids: selectedIds, type })
    ElMessage.success(`${actionText}成功`)
    getList(query)
  })
}

const delConfirm = async row => {
  await commentApi.del({ ids: row.id })
  ElMessage.success('删除成功')
  getList(query)
}

const multipleSelection = ref([])
const selectionChange = val => {
  multipleSelection.value = val
}






// 顶/状态切换
const toggleTop = async (row, topVal) => {
  await commentApi.update({ id: row.id, top: topVal })
  ElMessage.success('更新成功')
  getList(query)
}
// 已取消状态字段与相关操作

let commentReplyInfo = reactive({
  isShow: false,
  title: '回复评论',
  info: {}
})

const replyComment = row => {
  // 深拷贝当前行数据，避免直接修改表格数据
  commentReplyInfo.info = JSON.parse(JSON.stringify(row))
  commentReplyInfo.isShow = true
}

const commentReplyClose = val => {
  if (val) {
    getList(query)
  }
  commentReplyInfo.isShow = false
}

onMounted(() => {
  getList(query)
})
</script>

<style lang="scss" scoped>
@use './index.scss' as *;
</style>
