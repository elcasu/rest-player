const Omx = require('node-omxplayer')
const State = require('../models/state')

module.exports = {
  player: null,
  start: async video => {
    if (this.player && this.player.running) {
      this.player.quit()
    }
    this.player = Omx(video.path, 'hdmi', false, 100)
    this.player.on('close', async () => {
      await State.stop()
    })
    await State.set(video, 'PLAYING')
  },
  stop: async () => {
    if (this.player && this.player.running) {
      this.player.quit()
    }
    await State.stop()
  }
}
