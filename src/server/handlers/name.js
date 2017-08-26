'use strict'

module.exports = state => (r, response) => {
  response.setHeader('Content-Type', 'text/plain')
  response.end(state.getName())
}
