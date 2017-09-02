'use strict'

module.exports = state => (r, response) => {
  let videos = state.getVideos()
  response.writeHead(200, { 'Content-Type': 'application/json' })
  response.end(JSON.stringify(videos))
}
