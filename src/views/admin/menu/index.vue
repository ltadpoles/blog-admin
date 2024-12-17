<template>
  <div class="content-tree">
    <div class="content-info-left">
      <el-scrollbar height="calc(100vh - 130px)">
        <el-tree ref="menuTreeRef"
                 node-key="id"
                 :render-after-expand="false"
                 :highlight-current="true"
                 :data="treeData"
                 :props="props"
                 :load="loadNode"
                 lazy
                 @node-click="nodeClick" />
      </el-scrollbar>
    </div>
    <div class="content-info-right">
      <div class="form-btn">
        <el-button type="primary" @click="add()">新增</el-button>
      </div>
      <el-table ref="tableRef" :data="tableData" border>
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
            <el-button link type="danger" size="small" @click="delData(scope.row)">删除</el-button>
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
import { reactive, ref } from 'vue'
import { list, del } from '@/api/menu'
import { dayjs, ElMessage, ElMessageBox } from 'element-plus'
import menuDrawer from './components/edit.vue'

defineOptions({
  name: 'AdminMenu',
})

const choiceNode = ref({ key: null, level: 1 })
const props = {
  label: 'name',
}

const menuTreeRef = ref(null)
const treeData = ref([
  {
    name: '菜单管理',
    children: [],
    id: null
  }
])
const loadNode = async (node, resolve) => {
  if (node.level === 0) {
    return resolve([{
      name: '菜单管理',
      children: [],
      id: null
    }])
  }
  choiceNode.value = node
  let data = await getMenu(node.key)

  return resolve(data)
}
const nodeClick = (data, node) => {
  choiceNode.value = node
  getMenu(data.id)
}

const getMenu = async (parentId) => {
  const { data } = await list({ parentId })
  tableData.value = data.data
  return data.data
}

const tableData = ref([])

const add = () => {
  menuDrawerInfo.isShow = true
  menuDrawerInfo.type = 1
  menuDrawerInfo.title = '菜单新增'
  menuDrawerInfo.id = choiceNode.value.key
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
    updateNode()
  }
}

const updateNode = () => {
  let node = menuTreeRef.value.getNode(choiceNode.value.key) // 通过节点id找到对应树节点对象
  node.loaded = false
  node.expand() // 主动调用展开节点方法，重新查询该节点下的所有子节点
}

const delData = row => {
  ElMessageBox.confirm(
    '确认删除此菜单及子节点?',
    '提示',
    {
      confirmButtonText: '确认',
      cancelButtonText: '取消',
      type: 'warning',
    }
  )
    .then(async () => {
      let { data } = await del({ id: row.id })
      updateNode()
      ElMessage({
        type: 'success',
        message: data.msg,
      })
    })

}
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