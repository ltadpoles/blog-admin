/**
 * @description 项目常量设置
 */
export default {
  // 路由白名单，不需要验证token
  ROUTER_WHITE_LIST: ['/login'],
  // 登录页路由
  LOGIN_URL: '/login',
  // 是否通过 menu 返回动态路由,默认使用全部注册路由
  ISASYNCROUTER: false,
  // 是否开启 token 刷新，默认不开启
  ISREFRESHTOKEN: false,
  // 面包屑是否显示，默认展示
  ISBREADCRUMB: true,
  // 面包屑icon是否显示，默认展示
  ISBREADCRUMBICON: true,
  // 标签是否展示，默认展示
  ISTAGS: true,
  // 标签icon是否显示，默认展示
  ISTAGSICON: true,
  // pinia持久化地址，可选 sessionStorage 与 localStorage
  PINIASTORY: sessionStorage,
  // 代理地址
  TARGETURL: '/api'
}
