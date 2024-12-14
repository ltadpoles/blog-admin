<template>
  <div class="content-info">
    <el-form ref="listFormRef" :inline="true" :model="formData" class="list-form">
      <el-form-item label="用户名" prop="username">
        <el-input v-model="formData.username" placeholder="请输入用户名" clearable />
      </el-form-item>
      <el-form-item label="用户状态" prop="status">
        <el-select v-model="formData.status" placeholder="请选择用户状态" clearable>
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
          <el-button type="danger" @click="confirm()">删除</el-button>
        </div>
        <div>
          <el-button @click="reset(listFormRef)" icon="Search">重置</el-button>
          <el-button type="primary" @click="search(listFormRef)" icon="Refresh">查询</el-button>
        </div>
      </div>
    </el-form>

    <el-table ref="tableRef" :data="tableData" border>
      <el-table-column type="selection" width="55" />
      <el-table-column prop="username" label="用户名" />
      <el-table-column prop="name" label="昵称" />
      <el-table-column prop="sex" label="性别">
        <template #default="scope">
          {{ scope.row.sex === 1 ? '男' : scope.row.sex === 0 ? '女' : '-' }}
        </template>
      </el-table-column>
      <el-table-column prop="phone" label="电话" />
      <el-table-column prop="email" label="邮箱" />
      <el-table-column prop="address" label="地址" />
      <el-table-column prop="status" label="用户状态">
        <template #default="scope">
          {{ scope.row.status === 1 ? '有效' : '无效' }}
        </template>
      </el-table-column>
      <el-table-column prop="create_time" label="创建时间">
        <template #default="scope">
          {{ dayjs(scope.row.create_time).format('YYYY-MM-DD') }}
        </template>
      </el-table-column>
      <el-table-column prop="remark" label="备注" />
      <el-table-column label="操作" width="100" align="center">
        <template #default>
          <el-button link type="primary" size="small">授权</el-button>
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
  </div>
</template>

<script setup>
import { onMounted, reactive, ref } from 'vue'
import { list } from '@/api/user'
import { dayjs } from 'element-plus'

defineOptions({
  name: 'AdminUser'
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
const getList = async query => {
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