/* eslint-disable import/no-extraneous-dependencies */
/*
    所有构建工具都是基于node平台运行的，模块化默认采用commonJs
*/
const { resolve } = require('path');
const HTMLWeboackPlugin = require('html-webpack-plugin');
// eslint-disable-next-line import/no-extraneous-dependencies
const MiniCssExtractPlugin = require('mini-css-extract-plugin');
// eslint-disable-next-line import/no-extraneous-dependencies
const OptimizeCssAssetsWebpackPlugin = require('optimize-css-assets-webpack-plugin');
// 设置node环境变量
process.env.NODE_ENV = 'development';

module.exports = {
  entry: './src/js/index.js',
  output: {
    filename: 'js/built.js',
    path: resolve(__dirname, 'build'),
  },
  module: {
    rules: [
      // 语法检查：eslint-loader eslint
      // 注意：只检查自己写的源码，不检查第三方库
      // 设置检查规则 package.json中的eslintConfig中设置
      // "eslintConfig": {
      //     "extends": "airbnb-base"
      //   }
      // airbnb --> eslint-config-airbnb-base eslint-plugin-import eslint
      {
        test: /\.js$/,
        exclude: /node_modules/,
        loader: 'eslint-loader',
        options: {
          // 自动修复eslint的错误
          fix: true,
        },
      },
      /*
                js兼容性处理：babel-loader @babel/core @babel/preset-env
                1.基本js兼容性问题处理 --> @babel/preset-env
                    问题：只能转换基本语法，如promise不能转换
                2.全部js兼容性处理 --> @babel/polly-fill（已被废弃）
                    问题：我只要解决部分兼容性问题但是所有兼容代码全部引入，太大了
                3.需要做兼容处理就做：按需加载 --> corejs
            */
      {
        test: /\.js$/,
        exclude: /node_modules/,
        use: {
          loader: 'babel-loader',
          options: {
            // 预设：指示babel做怎样的兼容性处理
            presets: [
              [
                '@babel/preset-env',
                {
                  // 按需加载
                  useBuiltIns: 'usage',
                  // 指定corejs版本
                  corejs: {
                    version: 3,
                  },
                  // 指定兼容性做到哪个版本浏览器
                  targets: {
                    chrome: '60',
                    firefox: '60',
                    ie: '9',
                    safari: '10',
                    edge: '17',
                  },
                },
              ],
            ],
            plugins: ['@babel/plugin-transform-runtime'],
          },
        },
      },
      {
        test: /\.css$/,
        use: [
          MiniCssExtractPlugin.loader,
          'css-loader',
          {
            loader: 'postcss-loader',
            options: {
              postcssOptions: {
                plugins: [
                  // eslint-disable-next-line global-require
                  [require('postcss-preset-env')()],
                ],
              },
            },
          },
        ],
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
  },
};
