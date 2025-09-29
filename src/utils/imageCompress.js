import imageCompression from 'browser-image-compression'

/**
 * 图片压缩配置
 */
const COMPRESS_OPTIONS = {
  // 最大文件大小 (MB)
  maxSizeMB: 0.5,
  // 最大宽度或高度
  maxWidthOrHeight: 1200,
  // 使用WebWorker
  useWebWorker: true,
  // 压缩质量 (0-1)
  initialQuality: 0.7,
  // 是否保持原始宽高比
  alwaysKeepResolution: false
  // 不强制指定文件类型，保持原始类型
}

/**
 * 压缩图片
 * @param {File} file - 原始图片文件
 * @param {Object} options - 压缩选项
 * @returns {Promise<File>} 压缩后的图片文件
 */
export const compressImage = async (file, options = {}) => {
  // 检查是否为图片文件
  if (!file.type.startsWith('image/')) {
    throw new Error('请选择图片文件')
  }

  // SVG文件不需要压缩，直接返回
  if (file.type === 'image/svg+xml') {
    return file
  }

  // 合并配置选项
  const compressOptions = { ...COMPRESS_OPTIONS, ...options }

  // 执行压缩
  // 注意：alwaysKeepResolution: false 确保保持原始宽高比
  // maxWidthOrHeight 会按比例缩放，不会拉伸图片
  const compressedFile = await imageCompression(file, compressOptions)

  // 创建新的File对象，确保保持原始文件名和类型
  const finalFile = new File([compressedFile], file.name, {
    type: file.type,
    lastModified: Date.now()
  })

  return finalFile
}

/**
 * 批量压缩图片
 * @param {File[]} files - 图片文件数组
 * @param {Object} options - 压缩选项
 * @returns {Promise<File[]>} 压缩后的图片文件数组
 */
export const compressImages = async (files, options = {}) => {
  const compressedFiles = await Promise.all(files.map(file => compressImage(file, options)))
  return compressedFiles
}

/**
 * 获取压缩配置预设
 */
export const getCompressPresets = () => {
  return {
    // 头像压缩配置
    avatar: {
      maxSizeMB: 0.2,
      maxWidthOrHeight: 200,
      initialQuality: 0.8,
      alwaysKeepResolution: false // 保持宽高比
    },
    // Logo压缩配置
    logo: {
      maxSizeMB: 0.2,
      maxWidthOrHeight: 400,
      initialQuality: 0.8,
      alwaysKeepResolution: false // 保持宽高比
    },
    // 文章封面压缩配置
    cover: {
      maxSizeMB: 0.5,
      maxWidthOrHeight: 1200,
      initialQuality: 0.7,
      alwaysKeepResolution: false // 保持宽高比
    },
    // 编辑器图片压缩配置
    editor: {
      maxSizeMB: 0.3,
      maxWidthOrHeight: 800,
      initialQuality: 0.7,
      alwaysKeepResolution: false // 保持宽高比
    },
    // SVG配置（不压缩）
    svg: {
      maxSizeMB: 2,
      maxWidthOrHeight: 2000,
      initialQuality: 1,
      alwaysKeepResolution: false // 保持宽高比
    }
  }
}
