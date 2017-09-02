import { h, Component } from 'preact'

import api from '../../api'

import style from './style.css'
import logo from './logo.png'

import Video from '../video/Video'

export default class Videos extends Component {

  constructor () {
    super()
    this.state = {
      videos: [],
      loaded: false,
      error: false
    }
  }

  componentDidMount () {
    if (!this.props.loaded)
      this.load()
  }

  async load () {
    try {
      this.setState({
        videos: api.videos(),
        loaded: true
      })
    } catch (e) {
      this.setState({ error: true })
    }
  }

  render (props, state) {

    let videos = props.loaded ? props.videos : state.videos

    if (state.error) {
      return (
        <div class={style.error}>ERROR</div>
      )
    }

    if (!props.loaded && !state.loaded) {
      return (
        <div class={style.loader}>LOADING</div>
      )
    }

    return (
      <div>
        <center>
          <div class={style.logoContainer}>
            <img src={logo} class={style.logo} />
          </div>
        </center>
        <div class={style.videos}>
          {videos.map(v => (<div class={style.video}><Video id={v} /></div>))}
        </div>
      </div>
    )
  }

}
