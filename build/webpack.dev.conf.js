'use strict'
const utils = require('./utils')
const webpack = require('webpack')
const config = require('../config')
const merge = require('webpack-merge')
const path = require('path')
const baseWebpackConfig = require('./webpack.base.conf')
const CopyWebpackPlugin = require('copy-webpack-plugin')
const HtmlWebpackPlugin = require('html-webpack-plugin')
const FriendlyErrorsPlugin = require('friendly-errors-webpack-plugin')
const portfinder = require('portfinder')

/* Mock数据(模拟数据)
在vue的开发过程中可以使用mock数据来模拟实际情况，
可以通过express在vue-cli中的build/dev-server.js下搭建一个后端服务器通过读取本地的json文件，为前端提供数据，
前端通过vue-resource插件中的ajax方式获取数据。
*/
const express = require('express')
const app = express() // 请求server

var appData = require('../src/common/data/data.json') // 加载本地数据文件
var seller = appData.seller
var goods = appData.goods
var ratings = appData.ratings
var apiRoutes = express.Router()
app.use('/api', apiRoutes) // 通过路由请求数据


const HOST = process.env.HOST
const PORT = process.env.PORT && Number(process.env.PORT)



const devWebpackConfig = merge(baseWebpackConfig, {
  module: {// 对单独的css文件进行处理
    rules: utils.styleLoaders({ sourceMap: config.dev.cssSourceMap, usePostCSS: true })
  },
  // cheap-module-eval-source-map is faster for development
  devtool: config.dev.devtool,// 方便开发时做源码调试的

  // these devServer options should be customized in /config/index.js
  devServer: {
    before(app){
      app.get('/api/seller', (req, res) => {
        res.json({
          errno: 0,
          data: seller
        }) // 接口返回json数据，上面配置的数据seller就赋值给data请求后调用
      }),
      app.get('/api/goods', (req, res) => {
        res.json({
          errno: 0,
          data: goods
        })
      }),
      app.get('/api/ratings', (req, res) => {
        res.json({
          errno: 0,
          data: ratings
        })
      })
    },
    clientLogLevel: 'warning',
    historyApiFallback: {
      rewrites: [
        { from: /.*/, to: path.posix.join(config.dev.assetsPublicPath, 'index.html') },
      ],
    },
    hot: true,
    contentBase: false, // since we use CopyWebpackPlugin.
    compress: true,
    host: HOST || config.dev.host,
    port: PORT || config.dev.port,
    open: config.dev.autoOpenBrowser,
    overlay: config.dev.errorOverlay
      ? { warnings: false, errors: true }
      : false,
    publicPath: config.dev.assetsPublicPath,
    proxy: config.dev.proxyTable,
    quiet: true, // necessary for FriendlyErrorsPlugin
    watchOptions: {
      poll: config.dev.poll,
    }
  },
  plugins: [ // 定义了一堆插件
    new webpack.DefinePlugin({ // 把process.env替换成../config/dev.env
      'process.env': require('../config/dev.env')
    }),
    new webpack.HotModuleReplacementPlugin(),// 热加载插件
    new webpack.NamedModulesPlugin(), // HMR shows correct file names in console on update.
    new webpack.NoEmitOnErrorsPlugin(), // 编译出现错误,回调过那段代码,使编译后运行的包不会发生错误
    // https://github.com/ampedandwired/html-webpack-plugin
    new HtmlWebpackPlugin({ // 编译后的名
      filename: 'index.html',
      template: 'index.html',
      inject: true
    }),
    // copy custom static assets
    new CopyWebpackPlugin([
      {
        from: path.resolve(__dirname, '../static'),
        to: config.dev.assetsSubDirectory,
        ignore: ['.*']
      }
    ])
  ]
})

module.exports = new Promise((resolve, reject) => {
  portfinder.basePort = process.env.PORT || config.dev.port
  portfinder.getPort((err, port) => {
    if (err) {
      reject(err)
    } else {
      // publish the new Port, necessary for e2e tests
      process.env.PORT = port
      // add port to devServer config
      devWebpackConfig.devServer.port = port

      // Add FriendlyErrorsPlugin
      devWebpackConfig.plugins.push(new FriendlyErrorsPlugin({
        compilationSuccessInfo: {
          messages: [`Your application is running here: http://${devWebpackConfig.devServer.host}:${port}`],
        },
        onErrors: config.dev.notifyOnErrors
        ? utils.createNotifierCallback()
        : undefined
      }))

      resolve(devWebpackConfig)
    }
  })
})
