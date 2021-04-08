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
  plugins: [
    new HTMLWeboackPlugin({
      template: './src/index.html',
      minify: {
        collapseWhitespace: true,
        removeComments: true,
      },
    }),
  ],
  mode: 'production'
};
