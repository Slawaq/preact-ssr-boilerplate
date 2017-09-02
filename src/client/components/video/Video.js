import { h, Component } from 'preact'

import style from './style.css'

class Video extends Component {
  render ({ id }) {
    return <iframe
      src={`https://www.youtube.com/embed/${id}`}
      class={style.video}
      frameborder='0'
      allowfullscreen
    />
  }
}

export default Video
