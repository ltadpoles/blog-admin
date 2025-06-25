import { fileURLToPath, URL } from 'node:url'
import path from 'node:path'

import { defineConfig, loadEnv } from 'vite'
import vue from '@vitejs/plugin-vue'
import VueDevTools from 'vite-plugin-vue-devtools'
import AutoImport from 'unplugin-auto-import/vite'
import Components from 'unplugin-vue-components/vite'
import { ElementPlusResolver } from 'unplugin-vue-components/resolvers'
import { createSvgIconsPlugin } from 'vite-plugin-svg-icons'
import viteCompression from 'vite-plugin-compression'
import { visualizer } from 'rollup-plugin-visualizer'

export default defineConfig(({ mode }) => {
  const env = loadEnv(mode, process.cwd(), '')
  return {
    // 全局常量注入
    define: {
      __APP_VERSION__: JSON.stringify(env.npm_package_version) // 项目版本号
    },
    envDir: 'env',
    plugins: [
      vue(),
      VueDevTools(),
      AutoImport({
        resolvers: [ElementPlusResolver()]
      }),
      Components({
        resolvers: [ElementPlusResolver()]
      }),
      createSvgIconsPlugin({
        iconDirs: [path.resolve(process.cwd(), 'src/assets/svg')],
        symbolId: 'icon-[dir]-[name]'
      }),
      viteCompression({
        verbose: true,
        disable: false,
        threshold: 1024,
        algorithm: 'gzip',
        deleteOriginFile: true
      }),
      visualizer({ open: false })
    ],
    resolve: {
      alias: {
        '@': fileURLToPath(new URL('./src', import.meta.url))
      }
    },
    server: {
      proxy: {
        '/api': {
          target: 'http://127.0.0.1:3000',
          changeOrigin: true,
          rewrite: path => path.replace(/^\/api/, '')
        }
      }
    },
    build: {
      rollupOptions: {
        output: {
          chunkFileNames: 'static/js/[name]-[hash].js', // 引入文件名的名称
          entryFileNames: 'static/js/[name]-[hash].js', // 包的入口文件名称
          assetFileNames: 'static/[ext]/[name]-[hash].[ext]', // 资源文件像 字体，图片等
          manualChunks(id) {
            // 将 node_modules 依赖分解为独立 chunk
            if (id.includes('node_modules')) {
              // 单独拆分大型库
              if (id.includes('element-plus')) {
                return 'vendor-element-plus'
              }
              if (id.includes('echarts')) {
                return 'vendor-echarts'
              }
            }
          }
        }
      },
      chunkSizeWarningLimit: 1500
    }
  }
})
