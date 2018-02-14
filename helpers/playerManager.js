const Omx = require('node-omxplayer')
const State = require('../models/state')

module.exports = {
  player: null,
  start: async (video, socket) => {
    if (this.player && this.player.running) {
      this.player.quit()
    }
    this.player = Omx(video.path, 'hdmi', false, 100)
    this.player.on('close', async () => {
      await State.stop()
      socket.emit('player',  {
        action: 'actions:video_stopped',
        message: await State.get()
      })
    })
    await State.set(video, 'PLAYING')
    socket.emit('player',  {
      action: 'actions:video_started',
      message: await State.get()
    })
  },
  stop: async () => {
    if (this.player && this.player.running) {
      this.player.quit()
    }
    await State.stop()
  }
}
