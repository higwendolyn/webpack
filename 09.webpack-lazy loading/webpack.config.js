const { resolve } = require('path');
const HTMLWeboackPlugin = require('html-webpack-plugin');

// 设置node环境变量
process.env.NODE_ENV = 'production';

module.exports = {
  // 单入口
  entry: './src/js/index.js',
  output: {
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
  optimization: {
    splitChunks: {
      chunks: 'all'
    }
  },
  mode: 'production'
};
