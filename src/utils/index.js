// 获取assets静态资源，动态传入文件路径
export const getSvgUrl = url => {
  return new URL(`../assets/svg/${url}`, import.meta.url).href
}

// 获取assets静态资源，动态传入文件路径
export const getImageUrl = url => {
  return new URL(`../assets/images/${url}`, import.meta.url).href
}
