const fs = require('fs')
const path = require('path')
const fetch = require('node-fetch')

const web = require('../../webpack/web')
const renderer = require('../../webpack/renderer')

let getState = async () => ({
  videos: await (await fetch('http://localhost:8090/api/videos')).json(),
  name: 'Derek'
})

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
  let cachedPage
  try {
    let state = await getState()

    if (process.env.NODE_ENV === 'production') {
      let render = await renderer.build()
      cachedPage = await page(state, render(state))
    } else {
      renderer.watch(async (render) => {
        console.log('------------------------------------------------')
        console.log(`${new Date().toLocaleTimeString()}: Server Side Renderer Updated!`)
        cachedPage = await page(state, render(state))
      })
    }
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
    if (page && req.url === '/')
      res.end(page)
    else
      next()
  }
}
