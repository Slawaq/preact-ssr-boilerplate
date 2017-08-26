const http = require('http')
const finalhandler = require('finalhandler')

const createState = require('./createState')
const handler = require('./handlers')
const cors = require('./tools/cors')

const port = process.env.PORT || 8090

let createApi = state => {
  let api = handler(state)
  return (req, res) => api(req, cors(res), finalhandler(req, res))
}

let app = async () => {

  let state = await createState()

  let api = createApi(state)

  let server = http.createServer(api)

  return new Promise((resolve, reject) => server.listen(port, '0.0.0.0', e => e ? reject(e) : resolve()))
}

app()
  .then(() => console.log(`Server started on ${port} port!`))
  .catch((err) => console.error('SERVER FAILED\r\n', err.stack))
