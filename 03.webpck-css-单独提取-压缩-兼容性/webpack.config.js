/*
    所有构建工具都是基于node平台运行的，模块化默认采用commonJs
*/
const { resolve } = require('path');
const HTMLWeboackPlugin = require('html-webpack-plugin');
const MiniCssExtractPlugin = require('mini-css-extract-plugin');
const OptimizeCssAssetsWebpackPlugin = require('optimize-css-assets-webpack-plugin');
// 设置node环境变量
process.env.NODE_ENV = 'development';

// optimize-css-assets-webpack-plugin

module.exports = {
    entry: './src/js/index.js',
    output: {
        filename: 'js/built.js',
        path: resolve(__dirname, 'build'), 
    },
    module: {
        rules: [
            {
                test: /\.css$/,
                use: [
                    // 创建style标签，将样式放入
                    // 'style-loader',
                    // 取代style-loader，作用：提取js中的css为单独文件
                    MiniCssExtractPlugin.loader,
                    // 将css整合到js文件中
                    'css-loader',
                    /*  css兼容性处理：postcss --> postcss-loader postcss-preset-env
                        帮postcss找到package.json中browserslist里面的配置，通过配置加载指定兼容性样式

                        "browserslist": {
                            // 开发环境 --> 设置node环境变量： process.env.NODE_ENV = 'development'
                            "development": [
                            "last 1 chrome version",
                            "last 1 firefox version",
                            "last 1 safari version"
                            ],
                            // 生产环境：默认是看盛传
                            "production": [
                            ">0.2%",
                            "not dead",
                            "not op_mini all"
                            ]
                        }
                    */
                    // 使用loader的默认配置
                    // 'postcss-loader'
                    // 修改loader的配置
                    {
                        loader: 'postcss-loader',
                        options: {
                            postcssOptions: {
                                plugins: [
                                    // postcss 的插件
                                    [require('postcss-preset-env')()] 
                                ]
                            }
                        }
                    }
                ]
            },
            {
                test: /\.(jpg|png|gif)$/,
                loader: 'url-loader',
                options: {
                    limit: 8 * 1024,
                    esModule: false,
                    name: '[hash:10].[ext]'
                },
            },
            {
                exclude: /\.(html|css|js|img|jpg|png|gif)$/,
                loader: 'file-loader',
            },
        ],
    },
    // plugins 的配置
    plugins: [
        new HTMLWeboackPlugin({
            template: './src/index.html',
        }),
        new MiniCssExtractPlugin({
            filename: 'css/built.css',
        }),
        // 压缩css
        new OptimizeCssAssetsWebpackPlugin(),
    ],
    // 模式
    mode: 'development',
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