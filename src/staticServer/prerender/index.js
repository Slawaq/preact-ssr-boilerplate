const fs = require('fs')
const path = require('path')
const delay = require('delay')
const underscore = require('underscore')

const web = require('../../../webpack/web')
const renderer = require('../../../webpack/renderer')

const pageStateGetters = require('./config')

const indexHtmlPath = path.resolve(__dirname, '..', '..', '..', 'build', 'index.html')
const statePollingIntervalMs = 5000
const initialStatePollingDelayMs = 10000

const getState = async (url) => {
  try {
    return await pageStateGetters[url]()
  } catch (err) {
    console.error('PreRender state fetching failed for ', url, err.stack)
    return null
  }
}

const cache = { }

const setPage = async (url, htmlRender) => {
  let state = await getState(url)
  let page = {
    state,
    html: await htmlRender(state)
  }
  cache[url] = page
}

const updatePage = async (url, htmlRender) => {
  let page = cache[url] || { }
  let state = page.state || null
  let newState = await getState(url)

  if (newState && !underscore.isEqual(newState, state)) {
    page.state = newState
    page.html = await htmlRender(page.state)
    console.log(`${new Date().toLocaleTimeString()}: Server Side PreRender page '${url}' is updated!`)
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

  return fs.readFileSync(indexHtmlPath).toString()
}

const fullHtml = render => async state => (await tamplate())
  .replace('<!--$serverState-->', `<script type="text/javascript">window.__INITIAL_STATE__ = ${JSON.stringify(state)};</script>`)
  .replace('<!--$serverRenderHere-->', render(state))

const productionPreRender = async () => {
  let render = await renderer.build()
  let htmlRender = fullHtml(render)

  for (let url of Object.keys(pageStateGetters))
    await setPage(url, htmlRender)

  return () => htmlRender
}

const devPreRender = () => {
  let htmlRender

  renderer.watch(async (render) => {
    try {
      htmlRender = fullHtml(render)
      console.log('------------------------------------------------')
      console.log(`${new Date().toLocaleTimeString()}: Server Side PreRender is updating!`)

      for (let url of Object.keys(pageStateGetters))
        await setPage(url, htmlRender)

      console.log(`${new Date().toLocaleTimeString()}: Server Side PreRender updated!`)
      console.log('------------------------------------------------')
    } catch (error) {
      console.log(`${new Date().toLocaleTimeString()}: Server Side PreRender failed!`, error.stack)
      console.log('------------------------------------------------')
    }
  })

  return () => htmlRender
}

const runStateUpdater = async (getHtmlRender) => {
  try {
    await delay(initialStatePollingDelayMs)
    while (true) {
      await delay(statePollingIntervalMs)

      for (let url of Object.keys(pageStateGetters))
        await updatePage(url, getHtmlRender())
    }
  } catch (err) {
    console.error('PreRender state polling failed', err.stack)
  }
}

let runPreRender = async () => {
  try {
    let getHtmlRender = process.env.NODE_ENV === 'production'
      ? await productionPreRender()
      : devPreRender()

    runStateUpdater(getHtmlRender)
  } catch (err) {
    console.error('SERVER SIDE RENDERING FAILED')
    console.error(err.stack)
  }
}

module.exports = async () => {
  await runPreRender()

  return (req, res, next) => {
    let url = req.url.split('?')[0]
    let page = cache[url]

    if (page && page.html)
      res.end(page.html)
    else
      next()
  }
}
