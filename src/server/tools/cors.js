'use strict'

module.exports = response => {
  response.setHeader('Access-Control-Allow-Origin', '*')
  return response
}
