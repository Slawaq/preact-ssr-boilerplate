class State {

  static getDefault () {
    return {
      videos: [
        123214,
        6546,
        32,
        432645,
        12312,
        12541,
        1212,
        1254756,
        56432332
      ],
      name: 'Derek'
    }
  }

  static async Connect () {
    // establish some connections
    return new State()
  }

  constructor () {
    Object.assign(this, State.getDefault())
  }

  getVideos () {
    return this.videos
  }

  getName () {
    return this.name
  }

}

module.exports = State.Connect
