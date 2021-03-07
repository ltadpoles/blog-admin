const devServerPort = 3000
const path = require('path')

function resolve(dir) {
    return path.join(__dirname, dir)
}

module.exports = {
    publicPath: '/',
    lintOnSave: process.env.NODE_ENV === 'development', // 将 lint 错误输出为编译警告
    productionSourceMap: false,
    devServer: {
        port: devServerPort,
        open: true,
        overlay: {
            warnings: false,
            errors: true
        },
        progress: false,
        proxy: {
            // 设置代理
            '/': {
                target: 'http://localhost:4000',
                changeOrigin: true,
                ws: true
            }
        }
    },
    pluginOptions: {
        'style-resources-loader': {
            preProcessor: 'less',
            patterns: [resolve('src/assets/style/common.less')] // 公共样式
        }
    },
    chainWebpack: config => {
        config.resolve.alias
            .set('@', resolve('src'))
            .set('assets', resolve('src/assets'))
            .set('components', resolve('src/components'))
            .set('public', resolve('public'))
    }
}
