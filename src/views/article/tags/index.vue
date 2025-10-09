<template>
  <div class="view-base">
    <div class="view-base-form">
      <el-form ref="formRef" :inline="true" :model="formData">
        <el-form-item label="标签名称" prop="name">
          <el-input v-model="formData.name" placeholder="请输入标签名称" clearable />
        </el-form-item>
        <el-form-item label="状态" prop="status">
          <el-select v-model="formData.status" placeholder="请选择状态" clearable>
            <el-option label="全部" value="" />
            <el-option label="启用" value="1" />
            <el-option label="禁用" value="0" />
          </el-select>
        </el-form-item>
        <el-form-item label="创建时间" prop="date">
          <el-date-picker
            v-model="formData.date"
            value-format="x"
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
        <el-table-column prop="name" label="标签名称" />
        <el-table-column prop="remark" label="描述" />
        <el-table-column prop="status" label="状态" align="center" width="100">
          <template #default="scope">
            <el-tag type="success" v-if="scope.row.status === '1'">启用</el-tag>
            <el-tag type="danger" v-else>禁用</el-tag>
          </template>
        </el-table-column>
        <el-table-column prop="createTime" label="创建时间">
          <template #default="scope">
            {{ dayjs(scope.row.createTime).format('YYYY-MM-DD HH:mm') }}
          </template>
        </el-table-column>
        <el-table-column prop="updateTime" label="更新时间">
          <template #default="scope">
            {{ scope.row.updateTime ? dayjs(scope.row.updateTime).format('YYYY-MM-DD HH:mm') : '' }}
          </template>
        </el-table-column>
        <el-table-column label="操作" width="100" align="center">
          <template #default="scope">
            <el-button link type="primary" icon="Edit" @click="editData(scope.row)" />
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
import editDialog from './components/edit.vue'
import { page, del } from '@/api/tag'

const formRef = useTemplateRef('formRef')
const formData = reactive({
  name: '',
  status: '',
  date: ''
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

const getList = async () => {
  let { data } = await page(query)
  tableData.value = data.data.list
  pageQuery.total = data.data.total
}
const currentChange = page => {
  query.pageNum = page
  getList(query)
}

const search = () => {
  pageQuery.currentPage = 1
  query.pageNum = 1
  if (formData.date) {
    formData.createTimeStart = formData.date[0]
    formData.createTimeEnd = formData.date[1]
  } else {
    formData.createTimeStart = null
    formData.createTimeEnd = null
  }
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

  ElMessageBox.confirm('确认删除选中标签？', '提示', {
    confirmButtonText: '确认',
    cancelButtonText: '取消',
    type: 'warning'
  })
    .then(async () => {
      try {
        let ids = multipleSelection.value.map(item => item.id).join()
        await del({ id: ids })
        ElMessage.success('删除成功')
        getList(query)
      } catch {
        // 失败
      }
    })
    .catch(() => {
      // 用户取消删除，不做处理
    })
}

const delConfirm = async row => {
  try {
    await del({ id: row.id })
    ElMessage.success('删除成功')
    getList(query)
  } catch {
    // 失败
  }
}

const multipleSelection = ref([])
const selectionChange = val => {
  multipleSelection.value = val
}

const addData = () => {
  editDialogInfo.isShow = true
  editDialogInfo.title = '新增标签'
  editDialogInfo.type = 1
  editDialogInfo.info = {}
}

const editData = row => {
  editDialogInfo.isShow = true
  editDialogInfo.title = '编辑标签'
  editDialogInfo.type = 2
  editDialogInfo.info = row
}

const editDialogInfo = reactive({
  title: '新增标签',
  isShow: false,
  type: 1,
  info: {}
})
const editDialogClose = val => {
  if (val) {
    getList(query)
  }
  editDialogInfo.isShow = false
}

onMounted(() => {
  getList(query)
})
</script>

<style lang="scss" scoped>
@use './index.scss' as *;
</style>
