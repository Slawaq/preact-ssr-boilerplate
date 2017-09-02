class State {

  static getDefault () {
    return {
      videos: [
        'c2ExwOAjLNw',
        'q9AoGc-OTCk',
        'VVV4xeWBIxE',
        'GzLvqCTvOQY',
        'P73REgj-3UE',
        'BN-34JfUrHY'
      ],
      about: {
        author: 'Slawaq',
        contact: 'dereckvk@gmail.com'
      }
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

  getAbout () {
    return this.about
  }

}

module.exports = State.Connect
