const Router = require('router')
const bodyParser = require('body-parser')
const finisher = require('../tools/finisher')

let setupRouter = state => {
  let router = new Router({ mergeParams: true })
  router.use(bodyParser.json())

  router.get('/api/videos', require('./videos')(state), finisher)
  router.get('/api/about', require('./about')(state), finisher)

  return router
}

module.exports = setupRouter
