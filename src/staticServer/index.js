const http = require('http')

const dev = require('./dev')
const prod = require('./prod')

const prerender = require('./prerender')

const port = process.env.PORT || 8080

let app = async () => {
  let prerenderMiddleware = await prerender()

  let handler = await (process.env.NODE_ENV === 'production' ? prod : dev)()

  let server = http.createServer((req, res) => prerenderMiddleware(req, res, () => handler(req, res)))

  return new Promise((resolve, reject) => server.listen(port, '0.0.0.0', e => e ? reject(e) : resolve()))
}

app()
  .then(() => console.log(`Static server started on ${port} port!`))
  .catch((err) => console.error('SERVER FAILED\r\n', err.stack))
