const { resolve } = require('path');
const HTMLWeboackPlugin = require('html-webpack-plugin');

// 设置node环境变量
process.env.NODE_ENV = 'production';

module.exports = {
  // 单入口
  // entry: './src/js/index.js',
  entry: {
    // 多入口：有一个入口，最终输出就有一个bundle
    main: './src/js/index.js',
    test: './src/js/test.js'
  },
  output: {
    // [name]取文件名
    filename: 'js/[name].[contenthash:10].js',
    path: resolve(__dirname, 'build'),
  },
  // plugins 的配置
  plugins: [
    new HTMLWeboackPlugin({
      template: './src/index.html',
      // 压缩html代码
      minify: {
        // 移除空格
        collapseWhitespace: true,
        // 移除注释
        removeComments: true,
      },
    }),
  ],
  /**
   * 1. 可以将node_modules中代码单独打包一个chunk最终输出
   * 2. 自动分析多入口文件中有没有公共的文件，如果有会打包成单独的一个chunk
   */
  optimization: {
    splitChunks: {
      chunks: 'all'
    }
  },
  // 模式
  // 生产环境下会自动压缩js UglifyPligin
  mode: 'production'
};
