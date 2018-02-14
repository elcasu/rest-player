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
      const newState = await State.get()
      console.log('[STOP] - state: ', newState)
      socket.emit('player',  {
        action: 'actions:video_stopped',
        message: newState
      })
    })
    await State.set(video, 'PLAYING')
    const newState = await State.get()
    console.log('[PLAY] - state: ', newState)
    socket.emit('player',  {
      action: 'actions:video_started',
      message: newState
    })
  },
  stop: async () => {
    if (this.player && this.player.running) {
      this.player.quit()
    }
    await State.stop()
  }
}
