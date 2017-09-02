const request = require('superagent')

const apiLink = 'http://localhost:8090/api'

class Api {

  async videos () {
    let response = await request.get(`${apiLink}/videos`)
    return response.body
  }

  async about () {
    let response = await request.get(`${apiLink}/about`)
    return response.body
  }

}

module.exports = new Api()
