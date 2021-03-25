const { resolve } = require('path');
const HTMLWeboackPlugin = require('html-webpack-plugin');

// 设置node环境变量
process.env.NODE_ENV = 'production';

module.exports = {
  entry: './src/js/index.js',
  output: {
    filename: 'js/built.[contenthash:10].js',
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
  // 模式
  // 生产环境下会自动压缩js UglifyPligin
  mode: 'production'
};
