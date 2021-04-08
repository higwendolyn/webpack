const { resolve } = require('path');
const HTMLWeboackPlugin = require('html-webpack-plugin');

// 设置node环境变量
process.env.NODE_ENV = 'production';

module.exports = {
  // 单入口
  entry: './src/js/index.js',
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
  optimization: {
    splitChunks: {
      chunks: 'all'
    }
  },
  mode: 'production'
};
