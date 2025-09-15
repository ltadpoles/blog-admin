<template>
  <div class="view-base">
    <div class="website-basic">
      <!-- 统计信息卡片 -->
      <el-row :gutter="20" class="mb-4">
        <el-col :span="6">
          <el-card class="stats-card">
            <div class="stats-item">
              <div class="stats-value">{{ statsData.totalRecords || 0 }}</div>
              <div class="stats-label">配置记录数</div>
            </div>
          </el-card>
        </el-col>
        <el-col :span="6">
          <el-card class="stats-card">
            <div class="stats-item">
              <div class="stats-value">{{ statsData.todayVisits || 0 }}</div>
              <div class="stats-label">今日访问</div>
            </div>
          </el-card>
        </el-col>
        <el-col :span="6">
          <el-card class="stats-card">
            <div class="stats-item">
              <div class="stats-value">{{ statsData.totalVisits || 0 }}</div>
              <div class="stats-label">总访问量</div>
            </div>
          </el-card>
        </el-col>
        <el-col :span="6">
          <el-card class="stats-card">
            <div class="stats-item">
              <div class="stats-value">
                <el-tag :type="formData.isMaintenance === '1' ? 'danger' : 'success'">
                  {{ formData.isMaintenance === '1' ? '维护中' : '正常' }}
                </el-tag>
              </div>
              <div class="stats-label">网站状态</div>
            </div>
          </el-card>
        </el-col>
      </el-row>

      <!-- 基础信息表单 -->
      <el-card class="box-card">
        <template #header>
          <div class="card-header">
            <span>网站基础信息</span>
            <div>
              <el-button @click="resetForm">重置</el-button>
              <el-button type="primary" :loading="loading" @click="saveForm">保存</el-button>
            </div>
          </div>
        </template>

        <el-form ref="formRef" :model="formData" label-width="120px" :rules="rules">
          <el-row :gutter="20">
            <el-col :span="12">
              <el-form-item label="网站名称" prop="siteName">
                <el-input v-model="formData.siteName" placeholder="请输入网站名称" />
              </el-form-item>
            </el-col>
            <el-col :span="12">
              <el-form-item label="网站URL" prop="siteUrl">
                <el-input v-model="formData.siteUrl" placeholder="请输入网站URL" />
              </el-form-item>
            </el-col>
          </el-row>

          <el-form-item label="网站描述" prop="siteDescription">
            <el-input v-model="formData.siteDescription" type="textarea" :rows="3" placeholder="请输入网站描述" />
          </el-form-item>

          <el-form-item label="网站关键词" prop="siteKeywords">
            <el-input
              v-model="formData.siteKeywords"
              type="textarea"
              :rows="2"
              placeholder="请输入网站关键词，用逗号分隔"
            />
          </el-form-item>

          <el-row :gutter="20">
            <el-col :span="12">
              <el-form-item label="网站Logo" prop="siteLogo">
                <el-input v-model="formData.siteLogo" placeholder="请输入Logo地址" />
              </el-form-item>
            </el-col>
            <el-col :span="12">
              <el-form-item label="网站图标" prop="siteFavicon">
                <el-input v-model="formData.siteFavicon" placeholder="请输入网站图标地址" />
              </el-form-item>
            </el-col>
          </el-row>

          <el-row :gutter="20">
            <el-col :span="12">
              <el-form-item label="联系邮箱" prop="siteEmail">
                <el-input v-model="formData.siteEmail" placeholder="请输入联系邮箱" />
              </el-form-item>
            </el-col>
            <el-col :span="12">
              <el-form-item label="联系电话" prop="sitePhone">
                <el-input v-model="formData.sitePhone" placeholder="请输入联系电话" />
              </el-form-item>
            </el-col>
          </el-row>

          <el-form-item label="联系地址" prop="siteAddress">
            <el-input v-model="formData.siteAddress" placeholder="请输入联系地址" />
          </el-form-item>

          <el-row :gutter="20">
            <el-col :span="12">
              <el-form-item label="版权信息" prop="siteCopyright">
                <el-input v-model="formData.siteCopyright" placeholder="请输入版权信息" />
              </el-form-item>
            </el-col>
            <el-col :span="12">
              <el-form-item label="ICP备案号" prop="siteIcp">
                <el-input v-model="formData.siteIcp" placeholder="请输入ICP备案号" />
              </el-form-item>
            </el-col>
          </el-row>

          <el-form-item label="GitHub地址" prop="githubUrl">
            <el-input v-model="formData.githubUrl" placeholder="请输入GitHub地址" />
          </el-form-item>

          <el-form-item label="网站公告" prop="siteNotice">
            <el-input v-model="formData.siteNotice" type="textarea" :rows="3" placeholder="请输入网站公告" />
          </el-form-item>

          <el-form-item label="关于我们" prop="siteAbout">
            <el-input v-model="formData.siteAbout" type="textarea" :rows="4" placeholder="请输入关于我们的内容" />
          </el-form-item>

          <el-form-item label="维护模式" prop="isMaintenance">
            <el-switch
              v-model="formData.isMaintenance"
              :active-value="'1'"
              :inactive-value="'0'"
              @change="handleMaintenanceChange"
            />
            <span class="ml-2 text-gray-500">开启后网站将进入维护模式</span>
          </el-form-item>

          <el-form-item v-if="formData.isMaintenance === '1'" label="维护提示" prop="maintenanceMessage">
            <el-input
              v-model="formData.maintenanceMessage"
              type="textarea"
              :rows="2"
              placeholder="请输入维护模式提示信息"
            />
          </el-form-item>

          <el-form-item label="备注" prop="remark">
            <el-input v-model="formData.remark" type="textarea" :rows="2" placeholder="请输入备注信息" />
          </el-form-item>
        </el-form>
      </el-card>
    </div>
  </div>
</template>

<script setup>
import { ElMessage } from 'element-plus'
import { reactive, ref, useTemplateRef, onMounted } from 'vue'
import * as websiteApi from '@/api/website'

const formRef = useTemplateRef('formRef')

const formData = reactive({
  id: null,
  siteName: '',
  siteDescription: '',
  siteKeywords: '',
  siteLogo: '',
  siteFavicon: '',
  siteUrl: '',
  siteEmail: '',
  sitePhone: '',
  siteAddress: '',
  siteCopyright: '',
  siteIcp: '',
  siteNotice: '',
  siteAbout: '',
  githubUrl: '',
  isMaintenance: '0',
  maintenanceMessage: '',
  operator: '',
  remark: ''
})

const statsData = reactive({
  totalRecords: 0,
  todayVisits: 0,
  totalVisits: 0,
  isMaintenance: '0',
  lastUpdate: null
})

const rules = {
  siteName: [{ required: true, message: '请输入网站名称', trigger: 'blur' }],
  siteUrl: [
    { required: true, message: '请输入网站URL', trigger: 'blur' },
    { type: 'url', message: '请输入正确的URL格式', trigger: 'blur' }
  ],
  siteEmail: [{ type: 'email', message: '请输入正确的邮箱格式', trigger: 'blur' }]
}

const loading = ref(false)

// 获取网站信息
const getWebsiteInfo = async () => {
  try {
    loading.value = true
    const { data } = await websiteApi.getWebsiteInfo()
    const info = data?.data || data
    if (info) {
      Object.assign(formData, info)
      // 更新统计信息
      if (info.stats) {
        Object.assign(statsData, info.stats)
      }
    }
  } catch {
    ElMessage.error('获取网站信息失败')
  } finally {
    loading.value = false
  }
}

// 获取统计信息
const getStats = async () => {
  try {
    const { data } = await websiteApi.getWebsiteStats()
    const stats = data?.data || data
    if (stats) {
      Object.assign(statsData, stats)
    }
  } catch {
    // 获取统计信息失败，静默处理
  }
}

// 保存表单
const saveForm = async () => {
  if (!formRef.value) {
    return
  }

  try {
    await formRef.value.validate()
    loading.value = true
    await websiteApi.updateWebsiteInfo(formData)
    ElMessage.success('保存成功')
    // 重新获取信息以更新统计
    await getWebsiteInfo()
  } catch (error) {
    if (error !== false) {
      ElMessage.error('保存失败')
    }
  } finally {
    loading.value = false
  }
}

// 重置表单
const resetForm = () => {
  if (formRef.value) {
    formRef.value.resetFields()
  }
}

// 维护模式切换
const handleMaintenanceChange = async value => {
  try {
    await websiteApi.toggleMaintenance({
      isMaintenance: value,
      maintenanceMessage: formData.maintenanceMessage
    })
    ElMessage.success(value === '1' ? '已开启维护模式' : '已关闭维护模式')
    // 更新统计信息
    statsData.isMaintenance = value
  } catch {
    ElMessage.error('切换维护模式失败')
    // 回滚状态
    formData.isMaintenance = value === '1' ? '0' : '1'
  }
}

onMounted(() => {
  getWebsiteInfo()
  getStats()
})
</script>

<style lang="scss" scoped>
.website-basic {
  .mb-4 {
    margin-bottom: 20px;
  }

  .stats-card {
    .stats-item {
      text-align: center;
      padding: 10px 0;

      .stats-value {
        font-size: 24px;
        font-weight: bold;
        color: var(--el-color-primary);
        margin-bottom: 8px;
      }

      .stats-label {
        font-size: 14px;
        color: var(--el-text-color-regular);
      }
    }
  }

  .box-card {
    .card-header {
      display: flex;
      justify-content: space-between;
      align-items: center;
      font-weight: 600;
    }
  }

  .el-form {
    .el-form-item {
      margin-bottom: 20px;

      .el-form-item__label {
        font-weight: 500;
      }
    }
  }

  .ml-2 {
    margin-left: 8px;
  }

  .text-gray-500 {
    color: #6b7280;
    font-size: 14px;
  }
}
</style>
