/*
    所有构建工具都是基于node平台运行的，模块化默认采用commonJs
*/
const { resolve } = require('path');
const HTMLWeboackPlugin = require('html-webpack-plugin');

module.exports = {
    // 入口起点
    entry: './src/index.js',
    // 输出
    output: {
        // 输出文件名
        filename: 'built.js',
        // 输出路径
        // __dirname是node.js的变量，代表当前文件的目录绝对路径
        path: resolve(__dirname, 'build'), 
    },
    // loader 的配置
    module: {
        rules: [
            // 详细的loader配置
            {
                test: /\.css$/,
                // use 数组中loader的执行顺序：从右往左，从下往上
                use: [
                    // 创建style标签，将js中的样式资源添加到head中生效
                    'style-loader',
                    // 将css文件编程commonjs模块加载到js中，里面的内容是字符串
                    'css-loader']
            },
            {
                // 问题：默认处理不了html中的img图片
                // 处理图片资源
                test: /\.(jpg|png|gif)$/,
                // 使用一个loader
                // 下载url-loader、 file-loader
                loader: 'url-loader',
                options: {
                    // 图片大小小于8kb，就会被base64处理
                    // 优点：减少请求数量（减轻服务器压力）
                    // 缺点：图片体积会更大（文件请求速度更慢）
                    limit: 8 * 1024,
                    // 问题：因为url-loader默认使用es6模块化解析，而html-loader引入拖图片是commonJs
                    // 解析时会出错 [Object Module]
                    // 解决：关闭url-loader的es6模块化，使用commonJs解析
                    esModule: false,
                    // 给图片进行重命名
                    // [hash:10]取图片hash值得前10位
                    // [ext]取图片的原扩展名
                    name: '[hash:10].[ext]'
                },
            },
            {
                test: /\.html$/,
                // 处理html中的img图片（负责引入img，从而能被url-loader处理）
                loader: 'html-withimg-loader',
            },
            {
                // 打包其他资源（除了html、css、js资源以外的资源）
                // 排除html、css、js资源
                exclude: /\.(html|css|js|img|jpg|png|gif)$/,
                loader: 'file-loader',
            },
        ],
    },
    // plugins 的配置
    plugins: [
        // html-webpack-plugin
        // 功能：默认会创建一个新的HTML，自动引入打包输出的所有资源（JS/CSS）
        // 需求：需要有结构的HTML文件
        new HTMLWeboackPlugin({
            // 复制 './src/index.html' 文件，并自动引入打包输出的所有资源（JS/CSS）
            template: './src/index.html',
        })
    ],
    // 模式
    mode: 'development',
    // 开发服务器的devServer：用来自动编译、自动打开浏览器、自动刷新浏览器
    // 特点：只会在内存中打包，而不会有任何输出
    // 启动devServer指令：npx webpack-dev-server
    devServer: {
        // 项目构建后路径
        contentBase: resolve(__dirname, 'build'),
        // 启动gzip压缩
        compress: true,
        // 端口号
        port: 3000,
        // 自动打开浏览器
        open: true,
    }
}