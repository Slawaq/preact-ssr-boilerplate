'use strict'

module.exports = state => (r, response) => response.end(JSON.stringify(state.getVideos()))
