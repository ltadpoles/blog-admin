<template>
  <div class="view-base">
    <div class="view-base-form">
      <el-form ref="formRef" :inline="true" :model="formData">
        <el-form-item label="IP地址" prop="ip">
          <el-input v-model="formData.ip" placeholder="请输入IP地址" clearable />
        </el-form-item>
        <el-form-item label="地区" prop="region">
          <el-input v-model="formData.region" placeholder="请输入国家/省份/城市" clearable />
        </el-form-item>
        <el-form-item label="运营商" prop="isp">
          <el-input v-model="formData.isp" placeholder="请输入运营商" clearable />
        </el-form-item>
        <el-form-item label="状态" prop="isBlocked">
          <el-select v-model="formData.isBlocked" placeholder="请选择状态" clearable>
            <el-option label="正常" value="0" />
            <el-option label="已封禁" value="1" />
          </el-select>
        </el-form-item>
        <el-form-item label="访问时间" prop="date">
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
          <el-button icon="Lock" type="warning" @click="batchBlock">批量封禁</el-button>
          <el-button icon="Unlock" type="success" @click="batchUnblock">批量解封</el-button>
          <el-button icon="Delete" type="info" @click="cleanupExpired">清理过期</el-button>
        </div>
        <div class="view-base-form-btn-right">
          <el-button icon="Refresh" @click="reset(formRef)">重置</el-button>
          <el-button type="primary" icon="Search" @click="search">搜索</el-button>
        </div>
      </div>
    </div>

    <div class="view-base-table">
      <el-table :data="tableData" border row-key="id" @selection-change="selectionChange">
        <el-table-column type="selection" />
        <el-table-column prop="ip" label="IP地址" />
        <el-table-column prop="country" label="国家" />
        <el-table-column prop="province" label="省份" />
        <el-table-column prop="city" label="城市" />
        <el-table-column prop="isp" label="运营商" show-overflow-tooltip />
        <el-table-column prop="visitCount" label="访问次数" align="center">
          <template #default="scope">{{ scope.row.visitCount || 0 }}</template>
        </el-table-column>
        <el-table-column prop="lastVisitTime" label="最后访问">
          <template #default="scope">
            {{ scope.row.lastVisitTime ? dayjs(scope.row.lastVisitTime).format('YYYY-MM-DD') : '-' }}
          </template>
        </el-table-column>
        <el-table-column prop="isBlocked" label="状态" align="center">
          <template #default="scope">
            <el-tag v-if="scope.row.isBlocked === '1'" type="danger">已封禁</el-tag>
            <el-tag v-else type="success">正常</el-tag>
          </template>
        </el-table-column>
        <el-table-column prop="blockReason" label="封禁原因" show-overflow-tooltip />
        <el-table-column prop="remark" label="备注" show-overflow-tooltip />
        <el-table-column prop="createTime" label="创建时间">
          <template #default="scope">
            {{ dayjs(scope.row.createTime).format('YYYY-MM-DD') }}
          </template>
        </el-table-column>
        <el-table-column label="操作" width="120" align="center">
          <template #default="scope">
            <el-popconfirm
              v-if="scope.row.isBlocked !== '1'"
              confirm-button-text="确认"
              cancel-button-text="取消"
              icon="InfoFilled"
              title="确认封禁此IP?"
              @confirm="blockIp(scope.row)"
            >
              <template #reference>
                <el-button link type="warning" icon="Lock" />
              </template>
            </el-popconfirm>
            <el-popconfirm
              v-else
              confirm-button-text="确认"
              cancel-button-text="取消"
              icon="InfoFilled"
              title="确认解封此IP?"
              @confirm="unblockIp(scope.row)"
            >
              <template #reference>
                <el-button link type="success" icon="Unlock" />
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
  </div>
</template>

<script setup>
import { ElMessage, ElMessageBox } from 'element-plus'
import { reactive, ref, useTemplateRef, onMounted } from 'vue'
import { dayjs } from 'element-plus'
import * as ipApi from '@/api/ip'

const formRef = useTemplateRef('formRef')
const formData = reactive({
  ip: '',
  region: '',
  isp: '',
  isBlocked: '',
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

const loading = ref(false)
const getList = async () => {
  try {
    loading.value = true
    const { data } = await ipApi.getIPList(query)
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

  ElMessageBox.confirm('确认删除选中IP记录？', '提示', {
    confirmButtonText: '确认',
    cancelButtonText: '取消',
    type: 'warning'
  }).then(async () => {
    const ids = multipleSelection.value.map(i => i.id)
    for (const id of ids) {
      await ipApi.deleteIP(id)
    }
    ElMessage.success('删除成功')
    getList(query)
  })
}

const delConfirm = async row => {
  await ipApi.deleteIP(row.id)
  ElMessage.success('删除成功')
  getList(query)
}

const multipleSelection = ref([])
const selectionChange = val => {
  multipleSelection.value = val
}

// 批量封禁
const batchBlock = () => {
  if (multipleSelection.value.length === 0) {
    return ElMessage.error('请至少选择一条数据')
  }
  ElMessageBox.prompt('请输入封禁原因', '批量封禁', {
    confirmButtonText: '确认',
    cancelButtonText: '取消',
    inputPattern: /.+/,
    inputErrorMessage: '封禁原因不能为空'
  }).then(async ({ value }) => {
    const ips = multipleSelection.value.map(i => i.ip)
    await ipApi.batchBlockIP({ ips, reason: value })
    ElMessage.success('批量封禁成功')
    getList(query)
  })
}

// 批量解封
const batchUnblock = () => {
  if (multipleSelection.value.length === 0) {
    return ElMessage.error('请至少选择一条数据')
  }
  ElMessageBox.confirm('确认批量解封选中IP？', '提示', {
    confirmButtonText: '确认',
    cancelButtonText: '取消',
    type: 'warning'
  }).then(async () => {
    const ips = multipleSelection.value.map(i => i.ip)
    await ipApi.batchUnblockIP({ ips })
    ElMessage.success('批量解封成功')
    getList(query)
  })
}

// 单个封禁
const blockIp = async row => {
  ElMessageBox.prompt('请输入封禁原因', '封禁IP', {
    confirmButtonText: '确认',
    cancelButtonText: '取消',
    inputPattern: /.+/,
    inputErrorMessage: '封禁原因不能为空'
  }).then(async ({ value }) => {
    await ipApi.blockIP({ ip: row.ip, reason: value })
    ElMessage.success('封禁成功')
    getList(query)
  })
}

// 单个解封
const unblockIp = async row => {
  await ipApi.unblockIP({ ip: row.ip })
  ElMessage.success('解封成功')
  getList(query)
}

// 清理过期IP记录
const cleanupExpired = () => {
  ElMessageBox.confirm('确认清理过期的IP记录？', '提示', {
    confirmButtonText: '确认',
    cancelButtonText: '取消',
    type: 'warning'
  }).then(async () => {
    await ipApi.cleanupExpiredIPs()
    ElMessage.success('清理成功')
    getList(query)
  })
}

onMounted(() => {
  getList(query)
})
</script>

<style lang="scss" scoped>
@use './index.scss' as *;
</style>
