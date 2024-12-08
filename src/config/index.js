/**
 * @description 项目常量设置
 */
export const ENV = {
  // 路由白名单，不需要验证token
  ROUTER_WHITE_LIST: ['/login', '/404'],
  // 登录页路由
  LOGIN_URL: '/login',
  // 是否通过 menu 返回动态路由,默认使用全部注册路由
  ISASYNCROUTER: true,
  // 是否开启 token 刷新，默认不开启
  ISREFRESHTOKEN: false,
  // pinia持久化地址，可选 sessionStorage 与 localStorage
  PINIASTORY: sessionStorage
}

/**
 * @description 业务常量设置
 */
export const CONFIG = {
  // 本地代理字符串
  PROXY_URL: import.meta.VITE_PROXY_URL,
  // 静态资源打包路径
  PUBLIC_BASE: import.meta.VITE_PUBLIC_BASE
}
