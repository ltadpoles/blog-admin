<template>
  <div class="content-tree">
    <div class="content-info-left">
      <el-scrollbar height="calc(100vh - 130px)">
        <el-tree ref="menuTreeRef"
                 node-key="id"
                 :highlight-current="true"
                 :default-expanded-keys="defaultExpandedKeys"
                 :data="treeData"
                 :props="props"
                 @node-click="nodeClick" />
      </el-scrollbar>
    </div>
    <div class="content-info-right">
      <div class="form-btn">
        <el-button type="primary" @click="add()">新增</el-button>
      </div>
      <el-table ref="tableRef" :data="tableData" border height="calc(100vh - 206px)">
        <el-table-column prop="code" label="编号" />
        <el-table-column prop="name" label="名称" />
        <el-table-column prop="type" label="类型">
          <template #default="scope">
            {{ scope.row.type === '1' ? '菜单' : scope.row.type === '2' ? '按钮' : '-' }}
          </template>
        </el-table-column>
        <el-table-column prop="url" label="路径" />
        <el-table-column prop="create_time" label="创建时间">
          <template #default="scope">
            {{ dayjs(scope.row.create_time).format('YYYY-MM-DD') }}
          </template>
        </el-table-column>
        <el-table-column prop="remark" label="备注" />
        <el-table-column label="操作" width="100" align="center">
          <template #default="scope">
            <el-button link type="primary" size="small" @click="edit(scope.row)">编辑</el-button>
            <el-button link type="danger" size="small">删除</el-button>
          </template>
        </el-table-column>
      </el-table>
    </div>

    <menu-drawer :isShow="menuDrawerInfo.isShow"
                 :title="menuDrawerInfo.title"
                 :type="menuDrawerInfo.type"
                 :id="menuDrawerInfo.id"
                 @close="menuDrawerClose" />
  </div>
</template>

<script setup>
import { onMounted, reactive, ref } from 'vue'
import { list } from '@/api/menu'
import { dayjs } from 'element-plus'
import menuDrawer from './components/edit.vue'

defineOptions({
  name: 'AdminMenu',
})

const choiceInfo = ref({})
const props = {
  label: 'name',
}
const defaultExpandedKeys = ref([null])
const menuTreeRef = ref(null)
const treeData = ref([
  {
    name: '菜单管理',
    children: [],
    id: null
  }
])
const nodeClick = (item) => {
  choiceInfo.value = item
  if (!item.children || item.children.length < 1) {
    getMenu(item, item.id ? item.id : null)
  }
}
const getMenu = async (node, parentId = null) => {
  const { data } = await list({ parentId })
  node.children = data.data
  tableData.value = data.data
}

const tableData = ref([])

const add = () => {
  menuDrawerInfo.isShow = true
  menuDrawerInfo.type = 1
  menuDrawerInfo.title = '菜单新增'
  menuDrawerInfo.id = choiceInfo.value.id
}
const edit = row => {
  menuDrawerInfo.isShow = true
  menuDrawerInfo.type = 2
  menuDrawerInfo.title = '菜单编辑'
  menuDrawerInfo.id = row.id
}
const menuDrawerInfo = reactive({
  isShow: false,
  title: '新增',
  type: 1,
  id: null
})
const menuDrawerClose = val => {
  menuDrawerInfo.isShow = false
  if (val) {
    // 新增
    if (menuDrawerInfo.type === 1) {
      menuTreeRef.value.append(val, choiceInfo.value)
    }

    // getMenu({ children: [], parentId: parentId.value })

  }
}

onMounted(() => {
  getMenu(treeData.value[0])
  choiceInfo.value = treeData.value[0]
})
</script>

<style lang="less" scoped>
.content-tree {
    background-color: var(--el-bg-color);
    border-radius: 5px;
    height: calc(100vh - 130px);
    display: flex;
}

.content-info-left {
    border-right: 1px solid var(--el-border-color);
    height: calc(100vh - 130px);
    width: 240px;
    min-width: 240px;
    padding: 20px 0;
}

.content-info-right {
    flex: 1;
    padding: 10px;
    overflow: hidden;

    .form-btn {
        margin-bottom: 10px;
    }
}
</style>