<template>
  <div class="view-base">
    <div class="view-base-form">
      <el-form ref="formRef" :inline="true" :model="formData">
        <el-form-item label="标题" prop="name">
          <el-input v-model="formData.name" placeholder="请输入标题" clearable />
        </el-form-item>
        <el-form-item label="标签" prop="tags">
          <el-select v-model="formData.tags" placeholder="请选择文章标签" clearable multiple>
            <el-option v-for="item in tagList" :key="item.id" :label="item.name" :value="item.id" />
          </el-select>
        </el-form-item>
        <el-form-item label="分类" prop="category">
          <el-select v-model="formData.category" placeholder="请选择文章分类" clearable>
            <el-option v-for="item in categoryList" :key="item.id" :label="item.name" :value="item.id" />
          </el-select>
        </el-form-item>
        <el-form-item label="创作类型" prop="type">
          <el-select v-model="formData.type" placeholder="请选择创作类型" clearable>
            <el-option label="全部" value="" />
            <el-option label="原创" value="1" />
            <el-option label="转载" value="2" />
          </el-select>
        </el-form-item>
        <el-form-item label="创建时间" prop="date">
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
          <el-button icon="CirclePlus" type="primary" @click="addData">新增</el-button>
          <el-button icon="Delete" type="danger" @click="delData">删除</el-button>
          <el-button type="primary" @click="addData">发布</el-button>
          <el-button type="danger" @click="addData">下架</el-button>
        </div>
        <div class="view-base-form-btn-right">
          <el-button icon="Refresh" @click="reset(formRef)">重置</el-button>
          <el-button type="primary" icon="Search" @click="search">搜索</el-button>
        </div>
      </div>
    </div>

    <div class="view-base-table">
      <el-table :data="tableData" border @selection-change="selectionChange">
        <el-table-column type="selection" width="45" />
        <el-table-column prop="title" label="标题" />
        <el-table-column prop="createUserName" label="作者" align="center" />
        <el-table-column prop="tags" label="标签" min-width="120px" class-name="tag-class">
          <template #default="scope">
            <el-tag class="tag-item" type="success" v-for="item in scope.row.tag" :key="item.id">{{
              item.name
            }}</el-tag>
          </template>
        </el-table-column>
        <el-table-column prop="category" label="分类" align="center">
          <template #default="scope">
            <el-tag v-for="item in scope.row.category" :key="item.id">{{ item.name }}</el-tag>
          </template>
        </el-table-column>
        <el-table-column prop="type" label="创作类型" align="center">
          <template #default="scope">
            {{ scope.row.type === 1 ? '原创' : '转载' }}
          </template>
        </el-table-column>
        <el-table-column prop="status" label="发布状态">
          <template #default="scope">
            {{ scope.row.status === '1' ? '已发布' : '未发布' }}
          </template>
        </el-table-column>
        <el-table-column prop="link" label="原文链接" />
        <el-table-column prop="createTime" label="创建时间" min-width="96px" align="center">
          <template #default="scope">
            {{ dayjs(scope.row.createTime).format('YYYY-MM-DD HH:mm') }}
          </template>
        </el-table-column>
        <el-table-column prop="updateTime" label="更新时间" min-width="96px" align="center">
          <template #default="scope">
            {{ scope.row.updateTime ? dayjs(scope.row.updateTime).format('YYYY-MM-DD HH:mm') : '' }}
          </template>
        </el-table-column>
        <el-table-column label="操作" width="120" class-name="table-btn">
          <template #default="scope">
            <el-button link type="primary" icon="Edit" @click="editData(scope.row)" />
            <el-popconfirm
              v-if="scope.row.top === 1"
              confirm-button-text="确认"
              cancel-button-text="取消"
              icon="Bottom"
              title="确认取消置顶?"
              @confirm="topConfirm(scope.row)"
            >
              <template #reference>
                <el-button link type="primary" icon="Bottom" />
              </template>
            </el-popconfirm>
            <el-popconfirm
              else
              confirm-button-text="确认"
              cancel-button-text="取消"
              icon="Top"
              title="确认置顶?"
              @confirm="topConfirm(scope.row)"
            >
              <template #reference>
                <el-button link type="primary" icon="Top" />
              </template>
            </el-popconfirm>
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

    <edit-dialog
      :isShow="editDialogInfo.isShow"
      :title="editDialogInfo.title"
      :type="editDialogInfo.type"
      :info="editDialogInfo.info"
      @close="editDialogClose"
    />
  </div>
</template>

<script setup>
import { ElMessage } from 'element-plus'
import { reactive, ref, useTemplateRef, onMounted } from 'vue'
import { dayjs } from 'element-plus'
import { ElMessageBox } from 'element-plus'
import editDialog from './components/edit/index.vue'

const formRef = useTemplateRef('formRef')
const formData = reactive({
  name: '',
  tags: '',
  category: '',
  type: '',
  date: ''
})

const tagList = ref([])
const categoryList = ref([])

const tableData = ref([
  {
    name: 'vue'
  }
])
const query = reactive({
  pageNum: 1,
  pageSize: 10,
  param: {}
})
const pageQuery = reactive({
  total: 0,
  currentPage: 1
})

const getList = () => {
  ElMessage.error('获取数据失败')
}
const currentChange = page => {
  query.pageNum = page
  getList(query)
}

const search = () => {
  pageQuery.currentPage = 1
  query.pageNum = 1
  query.param = Object.assign(query.param, formData)
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

  ElMessageBox.confirm('确认删除选中文章？', '提示', {
    confirmButtonText: '确认',
    cancelButtonText: '取消',
    type: 'warning'
  }).then(async () => {
    ElMessage.success('删除成功')
    getList(query)
  })
}

const delConfirm = () => {
  ElMessage.success('删除成功')
}
const topConfirm = () => {
  ElMessage.success('置顶成功')
}

const multipleSelection = ref([])
const selectionChange = val => {
  multipleSelection.value = val
}

const addData = () => {
  editDialogInfo.isShow = true
  editDialogInfo.title = '新增文章'
  editDialogInfo.type = 1
}

const editData = () => {
  editDialogInfo.isShow = true
  editDialogInfo.title = '编辑文章'
  editDialogInfo.type = 2
}

const editDialogInfo = reactive({
  title: '新增文章',
  isShow: false,
  type: 1,
  info: {}
})
const editDialogClose = () => {
  editDialogInfo.isShow = false
}

onMounted(() => {
  getList(query)
})
</script>

<style lang="scss" scoped>
@use './index.scss' as *;
</style>
