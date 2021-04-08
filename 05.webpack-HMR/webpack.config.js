/*
  HMR: hot module replacement 热模块替换
  作用：一个模块发生变化，只会更新打包这一个模块（而不会打包更新所有模块）
  极大提升更新速度

  样式文件：可以使用HMR功能：因为style-loader内部实现了~
  js文件：默认不使用HMR功能 --> 需要修改js代码，添加支持HMR功能代码
    注意：HMR功能对js的处理，只能处理非入口js文件
  html文件：默认不使用HMR功能，同时会导致问题：html文件不能热更新了~ (不用做HMR功能)
    解决：修改entry入口 将html文件引入
 */
const { resolve } = require('path');
const HTMLWeboackPlugin = require('html-webpack-plugin');

module.exports = {
  entry: ['./src/js/index.js', './src/index.html'],
  output: {
    filename: 'js/built.js',
    path: resolve(__dirname, 'build'),
  },
  module: {
    rules: [
      {
        test: /\.less$/,
        use: ['style-loader', 'css-loader', 'less-loader'],
      },
      {
        test: /\.css$/,
        use: ['style-loader', 'css-loader'],
      },
      {
        test: /\.(jpg|png|gif)$/,
        loader: 'url-loader',
        options: {
          limit: 8 * 1024,
          esModule: false,
          name: '[hash:10].[ext]',
        },
      },
      {
        test: /\.html$/,
        loader: 'html-loader',
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
  ],
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
    // 开启HMR功能
    // 当修改了webpack配置，新配置生效要重启服务
    hot: true,
  },
};
