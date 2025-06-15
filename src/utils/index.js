export const getImageUrl = path => {
  if (path.startsWith('@/')) {
    path = path.replace('@/', '/src/')
  }
  return new URL(path, import.meta.url).href
}
