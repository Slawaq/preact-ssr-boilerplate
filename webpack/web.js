const webpack = require('webpack')
const path = require('path')
const HtmlWebpackPlugin = require('html-webpack-plugin')
const ExtractTextPlugin = require('extract-text-webpack-plugin')
const merge = require('webpack-merge')

const commonConfig = require('./common.js')

const filename = 'bundle.js'
const inputFolder = path.resolve(__dirname, '..', 'src', 'client')

let config = merge(commonConfig, {
  entry: [path.resolve(inputFolder, 'index.js')],
  output: {
    filename,
    publicPath: '/'
  },
  plugins: [
    new HtmlWebpackPlugin({
      template: path.resolve(inputFolder, 'template.html')
    })
  ]
})

let devConfig = merge(config, {
  entry: ['webpack-hot-middleware/client'],
  devtool: 'inline-source-map',
  devServer: {
    hot: true
  },
  plugins: [
    new webpack.HotModuleReplacementPlugin(),
    new webpack.NamedModulesPlugin(),
    new ExtractTextPlugin({ disable: true })
  ]
})
let prodConfig = merge(config, {
  plugins: [
    new webpack.LoaderOptionsPlugin({
      minimize: true,
      debug: false
    }),
    new webpack.optimize.UglifyJsPlugin({
      beautify: false,
      mangle: {
        screw_ie8: true,
        keep_fnames: true
      },
      compress: {
        screw_ie8: true
      },
      comments: false
    }),
    new ExtractTextPlugin('style.css')
  ]
})

let compiler = webpack(process.env.NODE_ENV === 'production' ? prodConfig : devConfig)

let build = () => new Promise((resolve, reject) => compiler.run((err, stats) => {
  if (err) {
    reject(err)
    return
  }

  const info = stats.toJson()

  if (stats.hasErrors()) {
    console.log(info.errors)
    reject(new Error(info.errors))
  } else {
    console.log(stats.toString({
      colors: true
    }))
    resolve(stats)
  }
}))

let buildProdQuite = () => new Promise((resolve, reject) => webpack(prodConfig, resolve))

module.exports = { build, buildProdQuite, compiler }
