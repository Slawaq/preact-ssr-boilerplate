import { h, Component } from 'preact'
import request from 'superagent'

import style from './style.css'

export default class App extends Component {

  action = async () => {
    let response = await request.get('https://api.github.com/repos/Slawaq/preact-ssr-boilerplate')

    this.setState({ stars: response.body.stargazers_count })
  }

  render ({ name, videos }, { stars }) {
    return (
      <div class={style.app}>
        <center>
          <div class={style.logo} />
          <h2>👋🏻 Hello, {name}!</h2>
          <div>We've {videos.length} videos!</div>
          <button class={style.button} onClick={this.action}>👽</button>
          {stars != null ? <div>Also this project has {stars} ⭐️!</div> : ''}
        </center>
      </div>
    )
  }

}
