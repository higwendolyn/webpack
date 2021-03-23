const { resolve } = require('path');
const HTMLWeboackPlugin = require('html-webpack-plugin');
const MiniCssExtractPlugin = require('mini-css-extract-plugin');
const OptimizeCssAssetsWebpackPlugin = require('optimize-css-assets-webpack-plugin');
/**
 * tree-shaking: 去除无用代码
 *    前提：1.必须使用ES6模块化 2.开始production环境
 *    作用：减少代码体积
 * 
 *    在package.json中配置
 *        "sideEffects": false 所有代码没有副作用（都可以进行tree shaking）
 *        问题：可能会把css / @bable/pollyfill （副作用）文件干掉
 *        "sideEffects": ["*.css"]
 *  
 */

// 设置node环境变量
process.env.NODE_ENV = 'production';

// 复用loader
const commonCssLoader = [
  MiniCssExtractPlugin.loader,
  'css-loader',
  {
    loader: 'postcss-loader',
    options: {
      postcssOptions: {
        plugins: [
          [require('postcss-preset-env')()],
        ],
      },
    },
  },
];

module.exports = {
  entry: './src/js/index.js',
  output: {
    filename: 'js/built.[hash:10].js',
    path: resolve(__dirname, 'build'),
  },
  module: {
    rules: [
      // 语法检查：eslint-loader eslint
      {
        test: /\.js$/,
        exclude: /node_modules/,
        // 执行优先
        enforce: 'pre',
        loader: 'eslint-loader',
        options: {
          // 自动修复eslint的错误
          fix: true,
        },
      },
      // 以下loader只会处理一个
      // 注意：不能有两个配置处理同一种类型文件
      {
        oneOf: [
          {
            test: /\.css$/,
            use: commonCssLoader,
          },
          {
            test: /\.less$/,
            use: [...commonCssLoader, 'less-loader'],
          },
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
                // 开启缓存，第二次构建才会读取缓存
                cacheDirectory: true,
                plugins: ['@babel/plugin-transform-runtime'],
              },
            },
          },
          {
            test: /\.(jpg|png|gif)$/,
            loader: 'url-loader',
            options: {
              limit: 8 * 1024,
              esModule: false,
              name: '[hash:10].[ext]',
              outPath: 'imgs',
            },
          },
          {
            exclude: /\.(html|css|js|img|jpg|png|gif)$/,
            loader: 'file-loader',
            options: {
              outputPath: 'media',
            }
          },
        ]
      }
    ],
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
    new MiniCssExtractPlugin({
      filename: 'css/built.[hash:10].css',
    }),
    // 压缩css
    new OptimizeCssAssetsWebpackPlugin(),
  ],
  // 模式
  // 生产环境下会自动压缩js UglifyPligin
  mode: 'production',
  devtool: 'source-map',
};