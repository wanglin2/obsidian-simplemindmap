const path = require('path')
const VueLoaderPlugin = require('vue-loader/lib/plugin')
const MiniCssExtractPlugin = require('mini-css-extract-plugin')
const TerserPlugin = require('terser-webpack-plugin')
const CssMinimizerPlugin = require('css-minimizer-webpack-plugin')

const isProduction = process.env.NODE_ENV === 'production'
console.log('isProduction:', isProduction) // 调试用，确保正确输出环境变量

module.exports = {
  entry: './main.js',
  output: {
    filename: 'main.js',
    path: path.resolve(__dirname, '../'),
    libraryTarget: 'commonjs'
  },
  devtool: false,
  resolve: {
    extensions: ['.ts', '.js', '.vue'],
    alias: {
      vue$: 'vue/dist/vue.esm.js', // 确保使用完整版 Vue（包含模板编译器）
      '@': path.resolve(__dirname, './src'),
      stream: require.resolve('stream-browserify')
    },
    fallback: {
      string_decoder: require.resolve('string_decoder/'),
      buffer: require.resolve('buffer/'),
      util: require.resolve('util/')
    }
  },
  module: {
    rules: [
      {
        test: /\.vue$/,
        loader: 'vue-loader'
      },
      {
        test: /\.css$/,
        use: [
          isProduction ? MiniCssExtractPlugin.loader : 'vue-style-loader',
          'css-loader'
        ]
      },
      // 添加 SCSS/Sass 支持
      {
        test: /\.scss$/,
        use: [
          isProduction ? MiniCssExtractPlugin.loader : 'vue-style-loader',
          'css-loader',
          {
            loader: 'sass-loader',
            options: {
              sassOptions: {
                warnDeps: true, // 忽略第三方库警告
                quietDeps: true, // 忽略第三方库警告
                resolveVariables: true // 实验性：尝试解析变量
              }
            }
          }
        ]
      },
      {
        test: /\.less$/,
        use: [
          isProduction ? MiniCssExtractPlugin.loader : 'vue-style-loader',
          'css-loader',
          'less-loader'
        ]
      },
      // 图片
      {
        test: /\.(png|jpe?g|gif)$/i,
        type: 'asset/inline'
      },
      {
        test: /\.(woff|woff2|eot|ttf|svg)$/,
        type: 'asset/inline'
      },
      {
        test: /\.js$/,
        loader: 'babel-loader',
        exclude: /node_modules/
      }
    ]
  },
  plugins: [
    new VueLoaderPlugin(),
    ...(isProduction
      ? [
          new MiniCssExtractPlugin({
            filename: 'styles.css',
            ignoreOrder: false
          })
        ]
      : [])
  ],
  optimization: {
    minimize: isProduction,
    minimizer: [
      new TerserPlugin({
        terserOptions: {
          compress: {
            pure_funcs: ['console.log'] // 仅移除 console.log
          },
          format: { comments: false }
        }
      }), // 压缩 JS
      new CssMinimizerPlugin() // 压缩 CSS
    ]
  },
  externals: {
    obsidian: 'commonjs2 obsidian' // 排除 Obsidian API
  }
}
