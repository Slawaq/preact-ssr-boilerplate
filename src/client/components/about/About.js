import { h, Component } from 'preact'

import api from '../../api'

import style from './style.css'

class About extends Component {

  constructor () {
    super()
    this.state = {
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
        about: await api.about(),
        loaded: true
      })
    } catch (e) {
      this.setState({ error: true })
    }
  }

  render (props, state) {

    if (state.error)
      return (<div class={style.about}>ERROR</div>)

    if (!props.loaded && !state.loaded)
      return (<div class={style.about}>LOADING...</div>)

    let about = props.loaded
      ? props.about
      : state.about

    return (
      <div class={style.about}>
        <p class={style.text}>
          <a class={style.link} href={`https://github.com/${about.author}`} target='_blank'>github.com/{about.author}</a>
          <br />
          For all cooperation questions please contact: <a class={style.link} href={`mailto:${about.contact}`} target='_blank'>{about.contact}</a>
        </p>
      </div>
    )
  }
}

export default About
