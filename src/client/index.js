import { h, render } from 'preact'
import App from './components/App'

import './assets/style.css'
import './assets/images/favicon.png'

let initialState = window.__INITIAL_STATE__ || {
  name: 'World',
  videos: []
}

let root = document.getElementById('app')

if (module.hot) {
  require('preact/devtools')
  module.hot.accept('./components/App', () => {
    const NextApp = require('./components/App').default
    render(<NextApp {...initialState} />, root, root.lastElementChild)
  })
}

render(<App {...initialState} />, root, root.lastElementChild)
