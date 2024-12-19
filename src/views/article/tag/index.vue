<template>
  <div class="content-info">
    <el-form ref="listFormRef" :inline="true" :model="formData" class="list-form">
      <el-form-item label="标签名称" prop="name">
        <el-input v-model="formData.name" placeholder="请输入标签名称" clearable />
      </el-form-item>
      <el-form-item label="标签状态" prop="status">
        <el-select v-model="formData.status" placeholder="请选择标签状态" clearable>
          <el-option label="有效" value="1" />
          <el-option label="无效" value="0" />
        </el-select>
      </el-form-item>
      <el-form-item label="创建时间" prop="date">
        <el-date-picker v-model="formData.date"
                        value-format="x"
                        type="daterange"
                        range-separator="至"
                        start-placeholder="开始时间"
                        end-placeholder="结束时间" />
      </el-form-item>
      <div class="form-btn">
        <div>
          <el-button type="primary" @click="add">新增</el-button>
          <el-button type="danger" @click="delData">删除</el-button>
        </div>
        <div>
          <el-button @click="reset(listFormRef)" icon="Search">重置</el-button>
          <el-button type="primary" @click="search(listFormRef)" icon="Refresh">查询</el-button>
        </div>
      </div>
    </el-form>

    <el-table ref="tableRef" :data="tableData" border @selection-change="handleSelectionChange">
      <el-table-column type="selection" width="55" />
      <el-table-column prop="name" label="标签名称" />
      <el-table-column prop="status" label="标签状态">
        <template #default="scope">
          {{ scope.row.status === '1' ? '有效' : '无效' }}
        </template>
      </el-table-column>
      <el-table-column prop="create_time" label="创建时间">
        <template #default="scope">
          {{ dayjs(scope.row.create_time).format('YYYY-MM-DD') }}
        </template>
      </el-table-column>
      <el-table-column prop="remark" label="备注" />
      <el-table-column label="操作" width="100" align="center">
        <template #default="scope">
          <el-button link type="primary" size="small" @click="edit(scope.row)">编辑</el-button>
        </template>
      </el-table-column>
    </el-table>
    <div class="pagination">
      <el-pagination v-model:current-page="pageQuery.currentPage"
                     :page-size="query.pageSize"
                     layout="total, prev, pager, next,sizes"
                     :total="pageQuery.total"
                     @size-change="sizeChange"
                     @current-change="currentChange" />
    </div>

    <tag-drawer :isShow="tagDrawerInfo.isShow"
                :title="tagDrawerInfo.title"
                :type="tagDrawerInfo.type"
                :id="tagDrawerInfo.id"
                @close="tagDrawerClose" />
  </div>
</template>

<script setup>
import { onMounted, reactive, ref } from 'vue'
import { list, del } from '@/api/tag'
import { dayjs, ElMessage, ElMessageBox } from 'element-plus'
import tagDrawer from './components/edit.vue'

defineOptions({
  name: 'ArticleTag'
})

const listFormRef = ref(null)
let formData = reactive({})
const search = () => {
  pageQuery.currentPage = 1
  query.pageNum = 1
  if (formData.date) {
    formData.createTimeStart = formData.date[0]
    formData.createTimeEnd = formData.date[1]
  } else {
    formData.createTimeStart = ''
    formData.createTimeEnd = ''
  }
  query.param = Object.assign(query.param, formData)
  getList(query)
}
const reset = (formEl) => {
  if (!formEl) {
    return
  }
  formEl.resetFields()
  search()
}

const tagDrawerInfo = reactive({
  isShow: false,
  title: '新增',
  type: 1,
  id: null
})
const tagDrawerClose = val => {
  tagDrawerInfo.isShow = false
  if (val) {
    getList(query)
  }
}
const add = () => {
  tagDrawerInfo.isShow = true
  tagDrawerInfo.type = 1
  tagDrawerInfo.id = ''
  tagDrawerInfo.title = '标签新增'
}
const edit = row => {
  tagDrawerInfo.isShow = true
  tagDrawerInfo.type = 2
  tagDrawerInfo.id = row.id
  tagDrawerInfo.title = '标签修改'
}

const multipleSelection = ref([])
const handleSelectionChange = (val) => {
  multipleSelection.value = val
}
const delData = async () => {
  if (multipleSelection.value.length < 1) {
    return ElMessage.error('请选择需要删除的标签')
  }
  ElMessageBox.confirm(
    '确认删除选中标签?',
    '提示',
    {
      confirmButtonText: '确认',
      cancelButtonText: '取消',
      type: 'warning',
    }
  )
    .then(async () => {
      let id = multipleSelection.value.map(item => item.id).join()
      await del({ id: id })
      getList(query)
      ElMessage.success('操作成功')
    })
}


const tableRef = ref(null)
const tableData = ref([])
const query = reactive({
  pageNum: 1,
  pageSize: 10,
  param: {}
})
const pageQuery = reactive({
  currentPage: 1,
  total: 0
})
const getList = async () => {
  let { data } = await list(query)
  tableData.value = data.data.list
  pageQuery.total = data.data.total
}
const sizeChange = (pageSize) => {
  query.pageSize = pageSize
  search()
}
const currentChange = (pageNum) => {
  query.pageNum = pageNum
  query.param = Object.assign(query.param, formData)
  getList(query)
}

onMounted(() => {
  getList(query)
})
</script>

<style lang="less" scoped></style>