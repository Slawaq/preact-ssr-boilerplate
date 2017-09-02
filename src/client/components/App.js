import Router from 'preact-router'
import { h } from 'preact'

import Videos from './videos/Videos'
import About from './about/About'

const App = (props) => (
  <Router url={props.pathname}>
    <Videos default {...props} />
    <About path='/about' {...props} />
  </Router>
)

export default App
