const { resolve } = require('path');
const HTMLWeboackPlugin = require('html-webpack-plugin');
const MiniCssExtractPlugin = require('mini-css-extract-plugin');
const OptimizeCssAssetsWebpackPlugin = require('optimize-css-assets-webpack-plugin');
/**
 * 缓存:
 *  babel缓存
 *    cacheDirectory: true
 *    ---> 让第二次打包构建速度更快
 *  文件资源缓存
 *    hash: 每次webpack构建时会生成一个唯一的hash值。
 *      问题: 因为js和css同时使用一个hash值，如果重新打包，会导致所有缓存失效。（可能我却只改动一个文件）
 *    chunkhash: 根据chunk生成的hash值。如果打包来源于同一个chunk，那么hash值就一样
 *      问题: js和css的值还是一样的，因为css是在js中被引入的，所以同属于一个chunk
 *    contenthash: 根据文件的内容生成hash值，不同的文件hash值一定不一样
 *    ---> 让代码上线运行缓存更好使用
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
  mode: 'development',
  devtool: 'source-map',
};
