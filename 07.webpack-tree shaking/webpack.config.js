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
      {
        test: /\.js$/,
        exclude: /node_modules/,
        enforce: 'pre',
        loader: 'eslint-loader',
        options: {
          fix: true,
        },
      },
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
                presets: [
                  [
                    '@babel/preset-env',
                    {
                      useBuiltIns: 'usage',
                      corejs: {
                        version: 3,
                      },
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
  plugins: [
    new HTMLWeboackPlugin({
      template: './src/index.html',
      minify: {
        collapseWhitespace: true,
        removeComments: true,
      },
    }),
    new MiniCssExtractPlugin({
      filename: 'css/built.[hash:10].css',
    }),
    new OptimizeCssAssetsWebpackPlugin(),
  ],
  mode: 'production',
  devtool: 'source-map',
};
