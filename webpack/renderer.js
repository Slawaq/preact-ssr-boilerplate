const webpack = require('webpack')
const path = require('path')
const nodeExternals = require('webpack-node-externals')
const ExtractTextPlugin = require('extract-text-webpack-plugin')
const merge = require('webpack-merge')

const commonConfig = require('./common.js')

const filename = 'bundle.node.js'
const outputFolder = path.resolve(__dirname, '..', 'build')

let config = merge(commonConfig, {
  target: 'node',
  externals: [nodeExternals()],
  entry: path.resolve(__dirname, '..', 'src', 'client', 'renderToString.js'),
  output: {
    filename,
    libraryTarget: 'commonjs2'
  },
  plugins: [
    new ExtractTextPlugin('style.node.js')
  ]
})

let compiler = webpack(config)

let build = () => new Promise((resolve, reject) => compiler.run((err, stats) => {
  if (err)
    reject(err.details)

  const info = stats.toJson()

  if (stats.hasErrors())
    reject(info.errors)
  else
    resolve(require(path.resolve(outputFolder, filename)))
}))

let watch = subscriber => webpack(config).watch({}, (err, stats) => {
  if (err) {
    console.error(err.stack || err)
    if (err.details)
      console.error(err.details)
    return
  }

  const info = stats.toJson()

  if (stats.hasErrors())
    console.error(info.errors)

  if (stats.hasWarnings())
    console.warn(info.warnings)

  try {
    let modulePath = path.resolve(outputFolder, filename)
    delete require.cache[require.resolve(modulePath)]
    subscriber(require(modulePath))
  } catch (e) {
    console.log('CANNOT IMPORT', e.stack)
  }
})

module.exports = { build, watch }
