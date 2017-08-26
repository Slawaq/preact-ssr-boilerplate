const path = require('path')

const serveStatic = require('serve-static')
const finalhandler = require('finalhandler')

const web = require('../../webpack/web')

module.exports = async () => {
  await web.build()

  let serve = serveStatic(path.resolve(__dirname, '../..', 'build'), {
    extensions: [ 'html', 'htm', 'js' ],
    index: [ 'index.html' ]
  })

  let handler = (req, res) => serve(req, res, finalhandler(req, res))

  return handler
}
