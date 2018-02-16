const Omx = require('node-omxplayer')
const State = require('../models/state')

module.exports = {
  player: null,
  start: async (video, socket) => {
    if (this.player && this.player.running) {
      this.player.newSource(video.path, 'hdmi', false, 100)
    }
    else {
      this.player = Omx(video.path, 'hdmi', false, 100)
    }
    this.player.on('close', async () => {
      await State.stop()
      const newState = await State.get()
      socket.emit('player',  {
        state: newState
      })
    })
    await State.set(video, 'PLAYING')
    const newState = await State.get()
    socket.emit('player',  {
      state: newState
    })
  },
  stop: async socket => {
    if (this.player && this.player.running) {
      this.player.quit()
    }
    const newState = await State.stop()
    socket.emit('player',  {
      state: newState
    })
  },
  volUp: () => {
    this.player.volUp()
  },
  volDown: () => {
    this.player.volDown()
  }
}
