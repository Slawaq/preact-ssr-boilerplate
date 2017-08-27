import { h, Component } from 'preact'
import request from 'superagent'

import style from './style.css'
import { link } from '../../assets/style.css'
import logo from './logo.png'

export default class Videos extends Component {

  action = async () => {
    let response = await request.get('https://api.github.com/repos/Slawaq/preact-ssr-boilerplate')

    this.setState({ stars: response.body.stargazers_count })
  }

  render ({ name, videos }, { stars }) {
    return (
      <div>
        <center>
          <div class={style.logoContainer}>
            <img src={logo} class={style.logo} />
          </div>
          <h2>👋🏻 Hello, {name}!</h2>
          <div>We've {videos.length} videos!</div>
          <button class={style.button} onClick={this.action}>👽</button>
          {stars != null ? (
            <div>
              Also this project has {stars} ⭐️
              <br />
              <a class={link} href='/about'>about</a>
            </div>
          ) : ''}
        </center>
      </div>
    )
  }

}
