module.exports = {
    publicPath: '/',
    lintOnSave: process.env.NODE_ENV !== 'production',
    devServer: {
        port: 8888,
        open: true,
        // proxy: {
        //     '/api': {
        //         target: '<url>',
        //         ws: true,
        //         changeOrigin: true
        //     }
        // }  //设置代理
    }
}