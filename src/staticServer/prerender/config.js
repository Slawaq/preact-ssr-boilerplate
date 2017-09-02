const api = require('../../client/api')

const index = async () => (
  {
    videos: await api.videos(),
    loaded: true,
    pathname: '/'
  }
)

const about = async () => (
  {
    about: await api.about(),
    loaded: true,
    pathname: '/about'
  }
)

module.exports = {
  '': index,
  '/': index,
  '/about': about
}
