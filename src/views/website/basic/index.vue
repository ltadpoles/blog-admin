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

      <!-- Tab页面 -->
      <el-card class="box-card">
        <template #header>
          <div class="card-header">
            <span>网站管理</span>
            <div>
              <el-button @click="resetForm">重置</el-button>
              <el-button type="primary" :loading="loading" @click="saveForm">保存</el-button>
            </div>
          </div>
        </template>

        <el-tabs v-model="activeTab" class="website-tabs">
          <!-- 基本信息 -->
          <el-tab-pane label="基本信息" name="basic">
            <basic-info-tab
              :form-data="formData"
              :rules="rules"
              ref="basicInfoRef"
              @update:form-data="handleFormDataUpdate"
            />
          </el-tab-pane>

          <!-- 作者信息 -->
          <el-tab-pane label="作者信息" name="author">
            <author-tab :form-data="formData" :rules="rules" ref="authorRef" @update:form-data="handleFormDataUpdate" />
          </el-tab-pane>

          <!-- 社交信息 -->
          <el-tab-pane label="社交信息" name="social">
            <social-tab :form-data="formData" :rules="rules" ref="socialRef" @update:form-data="handleFormDataUpdate" />
          </el-tab-pane>

          <!-- 网站设置 -->
          <el-tab-pane label="网站设置" name="website">
            <website-tab
              :form-data="formData"
              :rules="rules"
              ref="websiteRef"
              @update:form-data="handleFormDataUpdate"
            />
          </el-tab-pane>
        </el-tabs>
      </el-card>
    </div>
  </div>
</template>

<script setup>
import { ElMessage } from 'element-plus'
import { reactive, ref, useTemplateRef, onMounted } from 'vue'
import * as websiteApi from '@/api/website'
import BasicInfoTab from './components/BasicInfoTab.vue'
import AuthorTab from './components/AuthorTab.vue'
import SocialTab from './components/SocialTab.vue'
import WebsiteTab from './components/WebsiteTab.vue'

const formRef = useTemplateRef('formRef')
const activeTab = ref('basic')
const basicInfoRef = useTemplateRef('basicInfoRef')
const authorRef = useTemplateRef('authorRef')
const socialRef = useTemplateRef('socialRef')
const websiteRef = useTemplateRef('websiteRef')

const formData = reactive({
  id: null,
  // 基本信息
  siteName: '',
  siteDescription: '',
  siteKeywords: '',
  siteLogo: '',
  siteUrl: '',
  siteNotice: '',
  // 作者信息
  authorName: '',
  authorAvatar: '',
  authorBio: '',
  authorAbout: '',
  // 社交信息
  githubUrl: '',
  giteeUrl: '',
  qqNumber: '',
  qqGroup: '',
  wechat: '',
  email: '',
  // 网站设置
  isMaintenance: '0',
  maintenanceMessage: '',
  isCommentAuditEnabled: '0',
  isBoardAuditEnabled: '0',
  // 其他
  siteCopyright: '',
  siteIcp: '',
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

// 处理子组件数据更新
const handleFormDataUpdate = newData => {
  Object.assign(formData, newData)
}

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
  try {
    // 验证当前激活的tab页面表单
    const currentTabRef = getCurrentTabRef()
    if (currentTabRef && currentTabRef.validate) {
      await currentTabRef.validate()
    }

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

// 获取当前激活tab的ref
const getCurrentTabRef = () => {
  const tabRefs = {
    basic: basicInfoRef.value,
    author: authorRef.value,
    social: socialRef.value,
    website: websiteRef.value
  }
  return tabRefs[activeTab.value]
}

// 重置表单
const resetForm = () => {
  if (formRef.value) {
    formRef.value.resetFields()
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

  .website-tabs {
    .el-tabs__content {
      padding: 20px 0;
    }

    .el-tab-pane {
      min-height: 400px;
    }
  }
}
</style>
