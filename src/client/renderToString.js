import { h } from 'preact'
import render from 'preact-render-to-string'

import App from './components/App'

module.exports = (props, pathname) => render(<App {...props} pathname={pathname} />)
