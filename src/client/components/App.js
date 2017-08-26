import { h, Component } from 'preact'

import style from './style.css'

export default class App extends Component {

  render ({ name, videos }) {
    return (
      <div class={style.app}>
        <center>
          <div class={style.logo} />
          <h2>Hello, {name}!</h2>
          <div>We've {videos.length} videos!</div>
        </center>
      </div>
    )
  }

}
