'use strict'

module.exports = state => (r, response) => {
  let about = state.getAbout()
  response.end(JSON.stringify(about))
}
