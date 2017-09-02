const webpackMiddleware = require('webpack-dev-middleware')
const webpackHotMiddleware = require('webpack-hot-middleware')
const finalhandler = require('finalhandler')

const web = require('../../webpack/web')

module.exports = () => {
  let compiler = web.compiler

  let build = webpackMiddleware(compiler, {
    hot: true,
    publicPath: '/',
    stats: {
      colors: true
    }
  })

  let hot = webpackHotMiddleware(compiler)

  return (req, res) =>
    build(req, res, () =>
      hot(req, res, finalhandler(req, res)))
}
