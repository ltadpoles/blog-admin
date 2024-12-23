<template>
  <div class="content-info">
    <el-form ref="listFormRef" :inline="true" :model="formData" class="list-form">
      <el-form-item label="文章名称" prop="name">
        <el-input v-model="formData.name" placeholder="请输入文章名称" clearable />
      </el-form-item>
      <el-form-item label="文章状态" prop="status">
        <el-select v-model="formData.status" placeholder="请选择文章状态" clearable>
          <el-option label="已上架" value="1" />
          <el-option label="未上架" value="0" />
        </el-select>
      </el-form-item>
      <el-form-item label="文章类别" prop="category">
        <el-select v-model="formData.category" placeholder="请选择类别" clearable>
          <el-option v-for="item in categoryList" :key="item.id" :label="item.name" :value="item.id" />
        </el-select>
      </el-form-item>
      <el-form-item label="文章标签" prop="tags">
        <el-select v-model="formData.tags" placeholder="请选择标签" multiple clearable>
          <el-option v-for="item in tagList" :key="item.id" :label="item.name" :value="item.id" />
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
          <el-button type="primary" @click="addArticle">新增</el-button>
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
      <el-table-column prop="title" label="文章名称" />
      <el-table-column prop="image" label="图片" />
      <el-table-column prop="type" label="类别" align="center">
        <template #default="scope">
          <el-tag type="primary" v-for="item in scope.row.category" :key="item.id">{{ item.name }}</el-tag>
        </template>
      </el-table-column>
      <el-table-column prop="type" label="标签" align="center">
        <template #default="scope">
          <el-tag style="margin-right: 3px;" type="success" v-for="item in scope.row.tag" :key="item.id">{{ item.name
          }}</el-tag>
        </template>
      </el-table-column>
      <el-table-column prop="type" label="文章类型">
        <template #default="scope">
          {{ scope.row.type === '1' ? '原创' : '转载' }}
        </template>
      </el-table-column>
      <el-table-column prop="link" label="转载地址" />
      <el-table-column prop="like" label="点赞数" />
      <el-table-column prop="status" label="文章状态">
        <template #default="scope">
          {{ scope.row.status === '1' ? '已上架' : '未上架' }}
        </template>
      </el-table-column>
      <el-table-column prop="create_time" label="创建时间">
        <template #default="scope">
          {{ dayjs(scope.row.create_time).format('YYYY-MM-DD') }}
        </template>
      </el-table-column>
      <el-table-column prop="update_time" label="更新时间">
        <template #default="scope">
          {{ scope.row.update_time ? dayjs(scope.row.update_time).format('YYYY-MM-DD') : '-' }}
        </template>
      </el-table-column>
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

    <edit-dialog :isShow="editInfo.isShow"
                 :title="editInfo.title"
                 :id="editInfo.id"
                 :type="editInfo.type"
                 @close="editClose" />
  </div>
</template>

<script setup>
import { onMounted, reactive, ref } from 'vue'
import { list } from '@/api/article'
import { listAllCategory } from '@/api/category'
import { listAllTag } from '@/api/tag'
import { dayjs, ElMessage, ElMessageBox } from 'element-plus'
import editDialog from './components/edit.vue'

defineOptions({
  name: 'ArticleIndex'
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

// const tagDrawerInfo = reactive({
//   isShow: false,
//   title: '新增',
//   type: 1,
//   id: null
// })

const multipleSelection = ref([])
const handleSelectionChange = (val) => {
  multipleSelection.value = val
}
const delData = async () => {
  if (multipleSelection.value.length < 1) {
    return ElMessage.error('请选择需要删除的文章')
  }
  ElMessageBox.confirm(
    '确认删除选中文章?',
    '提示',
    {
      confirmButtonText: '确认',
      cancelButtonText: '取消',
      type: 'warning',
    }
  )
    .then(async () => {
      // let id = multipleSelection.value.map(item => item.id).join()
      // await del({ id: id })
      getList(query)
      ElMessage.success('操作成功')
    })
}

const editInfo = reactive({
  isShow: false,
  title: '新增文章',
  id: '',
  type: 1
})
const addArticle = () => {
  editInfo.isShow = true
  editInfo.title = '新增文章'
  editInfo.type = 1
  editInfo.id = ''
}
const editClose = val => {
  editInfo.isShow = false
  if (val) {
    getList(query)
  }
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

const tagList = ref([])
const getAllTag = async () => {
  let { data } = await listAllTag()
  tagList.value = data.data
}
const categoryList = ref([])
const getCategory = async () => {
  let { data } = await listAllCategory()
  categoryList.value = data.data
}

onMounted(() => {
  getAllTag()
  getCategory()
  getList(query)
})
</script>

<style lang="less" scoped></style>