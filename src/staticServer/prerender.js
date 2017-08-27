const fs = require('fs')
const path = require('path')
const fetch = require('node-fetch')

const web = require('../../webpack/web')
const renderer = require('../../webpack/renderer')

let getState = async () => {
  try {
    return {
      videos: await (await fetch('http://localhost:8090/api/videos')).json(),
      name: await (await fetch('http://localhost:8090/api/name')).text()
    }
  } catch (err) {
    console.error('PreRender state fetching failed', err.stack)
    return { }
  }
}

const tamplate = async () => {
  /**
   * !! FOR DEV MODE !!
   * It depends on generated index.html, which appears via standart PROD build
   * So, it must be generated! if current env is DEV
   */
  if (process.env.NODE_ENV !== 'production')
    await web.buildProdQuite()

  return fs.readFileSync(path.resolve(__dirname, '..', '..', 'build', 'index.html')).toString()
}

let page = async (state, view) => (await tamplate())
  .replace('<!--$serverState-->', `<script type="text/javascript">window.__INITIAL_STATE__ = ${JSON.stringify(state)};</script>`)
  .replace('<!--$serverRenderHere-->', view)

let createRender = async () => {
  let cachedPage, state, render
  try {
    state = await getState()

    if (process.env.NODE_ENV === 'production') {
      render = await renderer.build()
      cachedPage = await page(state, render(state))
    } else {
      renderer.watch(async (newRender) => {
        render = newRender
        console.log('------------------------------------------------')
        console.log(`${new Date().toLocaleTimeString()}: Server Side Renderer Updated!`)
        cachedPage = await page(state, render(state))
      })
    }

    // TODO: Replace on subscribe, or some polling, STATE DIFFS!
    setInterval(async () => {
      let newState = await getState()
      let stateIsSame = () => state.name === newState.name && state.videos.length === newState.videos.length && state.videos.every((v, i) => v === newState.videos[i])
      if (render && !stateIsSame())
        cachedPage = await page(state, render(state))
    }, 1000)

  } catch (err) {
    console.error('SERVER SIDE RENDERING FAILED')
    console.error(err.stack)
  }

  return () => cachedPage
}

module.exports = async () => {
  let render = await createRender()

  return (req, res, next) => {
    let page = render()
    if (page && (req.url === '/' || req.url === '/about'))
      res.end(page)
    else
      next()
  }
}
