# 博客管理后台系统

一个基于 Vue 3 + Vite + Element Plus 构建的现代化博客管理后台系统，提供完整的博客内容管理、用户管理、数据统计等功能。

## ✨ 特性

- 🚀 **现代化技术栈**：Vue 3 + Vite + Element Plus + Pinia
- 🌍 **国际化支持**：内置中英文切换
- 🎨 **主题切换**：支持明暗主题切换
- 📊 **数据可视化**：基于 ECharts 的数据统计图表
- 🔒 **权限管理**：完整的用户认证和权限控制
- 📝 **富文本编辑**：集成 Markdown 编辑器
- 🔄 **状态管理**：Pinia 状态管理，支持数据持久化
- 📦 **自动导入**：组件和 API 自动导入

## 🏗️ 项目结构

```
blog-admin/
├── public/                 # 静态资源
├── src/
│   ├── api/               # API 接口
│   │   ├── admin.js       # 管理员接口
│   │   ├── article.js     # 文章接口
│   │   ├── category.js    # 分类接口
│   │   ├── comment.js     # 评论接口
│   │   ├── tag.js         # 标签接口
│   │   └── user.js        # 用户接口
│   ├── assets/            # 静态资源
│   │   ├── images/        # 图片资源
│   │   ├── styles/        # 全局样式
│   │   └── svg/           # SVG 图标
│   ├── components/        # 公共组件
│   │   ├── dialog/        # 对话框组件
│   │   ├── drawer/        # 抽屉组件
│   │   ├── emoji-picker/  # 表情选择器
│   │   └── svgIcon/       # SVG 图标组件
│   ├── config/            # 配置文件
│   ├── hooks/             # 自定义 Hooks
│   ├── i18n/              # 国际化配置
│   ├── layout/            # 布局组件
│   │   ├── components/    # 布局子组件
│   │   │   ├── header/    # 头部组件
│   │   │   ├── sidebar/   # 侧边栏组件
│   │   │   ├── footer/    # 底部组件
│   │   │   └── tags/      # 标签页组件
│   │   └── index.vue      # 主布局
│   ├── router/            # 路由配置
│   │   ├── modules/       # 路由模块
│   │   └── index.js       # 路由主文件
│   ├── stores/            # 状态管理
│   │   └── modules/       # 状态模块
│   ├── utils/             # 工具函数
│   │   └── http/          # HTTP 请求封装
│   └── views/             # 页面组件
│       ├── dashboard/     # 仪表盘
│       ├── article/       # 文章管理
│       ├── system/        # 系统管理
│       ├── website/       # 网站设置
│       └── login/         # 登录页面
├── env/                   # 环境变量配置
├── dist/                  # 构建输出目录
├── vite.config.js         # Vite 配置
├── package.json           # 项目配置
└── README.md              # 项目说明
```

## 🚀 快速开始

### 环境要求

- Node.js >= 16.0.0
- pnpm >= 7.0.0 (推荐)

### 安装依赖

```bash
# 使用 pnpm (推荐)
pnpm install

# 或使用 npm
npm install

# 或使用 yarn
yarn install
```

### 开发环境运行

```bash
pnpm dev
```

项目将在 `http://localhost:8090` 启动

### 构建生产版本

```bash
pnpm build
```

### 代码检查和格式化

```bash
# 代码检查
pnpm lint

# 代码格式化
pnpm format
```

### 预览构建结果

```bash
pnpm preview
```

## 📋 主要功能

### 🏠 仪表盘
- 数据统计概览
- 文章、标签、分类数量统计
- 多种图表展示（柱状图、折线图、饼图、散点图等）
- 访问量统计

### 📝 文章管理
- 文章列表查看和搜索
- 文章新增、编辑、删除
- Markdown 编辑器支持
- 文章分类和标签管理
- 文章置顶功能
- 文章状态管理

### 💬 评论管理
- 评论列表查看
- 评论审核和删除
- 留言板管理
- 评论回复功能

### 🏷️ 分类标签
- 分类管理（增删改查）
- 标签管理（增删改查）
- 分类和标签的关联管理

### 👥 用户管理
- 用户列表查看
- 用户信息管理
- 用户权限控制

### 🔧 系统管理
- IP 访问记录
- 系统设置
- 网站基本信息配置

### 🌐 网站设置
- 网站基本信息设置
- SEO 配置
- 社交媒体链接配置

## 🛠️ 技术栈

### 前端框架
- **Vue 3** - 渐进式 JavaScript 框架
- **Vite** - 下一代前端构建工具
- **Vue Router 4** - Vue.js 官方路由管理器

### UI 组件库
- **Element Plus** - 基于 Vue 3 的组件库
- **Element Plus Icons** - 图标库

### 状态管理
- **Pinia** - Vue 的状态管理库
- **pinia-plugin-persistedstate** - Pinia 持久化插件

### 工具库
- **Axios** - HTTP 客户端
- **crypto-js** - 加密库
- **nprogress** - 页面加载进度条
- **@vueuse/core** - Vue 组合式 API 工具集

### 编辑器
- **md-editor-v3** - Markdown 编辑器

### 图表库
- **ECharts** - 数据可视化图表库

### 国际化
- **vue-i18n** - Vue.js 国际化插件

### 开发工具
- **ESLint** - 代码检查工具
- **Prettier** - 代码格式化工具
- **Sass** - CSS 预处理器
- **unplugin-auto-import** - 自动导入插件
- **unplugin-vue-components** - 组件自动导入插件

### 构建优化
- **vite-plugin-compression** - Gzip 压缩插件
- **rollup-plugin-visualizer** - 打包分析插件
- **vite-plugin-svg-icons** - SVG 图标插件

## ⚙️ 配置说明

### 环境配置

项目支持多环境配置，配置文件位于 `env/` 目录下：

- `env/.env` - 基础环境变量
- `env/.env.development` - 开发环境变量
- `env/.env.production` - 生产环境变量

### 代理配置

开发环境 API 代理配置：

```javascript
// vite.config.js
server: {
  port: 8090,
  proxy: {
    '/api': {
      target: 'http://127.0.0.1:3000',
      changeOrigin: true
    }
  }
}
```

### 路由配置

- 支持动态路由
- 路由守卫和权限控制
- 面包屑导航
- 标签页管理

### 主题配置

- 支持明暗主题切换
- 可自定义主题色
- Element Plus 主题定制

## 🔐 权限管理

- **登录认证**：用户名密码登录
- **Token 管理**：JWT Token 自动刷新
- **路由守卫**：页面访问权限控制
- **API 权限**：接口访问权限验证

## 🌍 国际化

支持中英文切换：
- 界面文本国际化
- 日期时间本地化
- 数字格式本地化

## 🎨 主题系统

- **明暗主题**：支持明暗主题一键切换
- **主题色**：可自定义主题颜色
- **布局设置**：可配置侧边栏、标签页等显示

## 🔧 开发建议

### 代码规范
- 使用 ESLint + Prettier 保证代码质量
- 遵循 Vue 3 Composition API 最佳实践
- 组件命名采用 PascalCase
- 文件命名采用 kebab-case

### 性能优化
- 组件懒加载
- 路由懒加载
- 图片懒加载
- 代码分割
- Gzip 压缩

## 📄 许可证

本项目采用 MIT 许可证 - 查看 [LICENSE](LICENSE) 文件了解详情

## 📞 联系方式

如有问题或建议，请提交 Issue 或 Pull Request。

---

⭐ 如果这个项目对你有帮助，请给个 Star 支持一下！