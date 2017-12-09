const express = require('express')
const { ErrorHandler } = require('../middlewares')
const Video = require('../models/video')
const MPlayer = require('mplayer')
 
const player = new MPlayer()

module.exports = class PlayerController {
  constructor (app) {
    const router = express.Router()

    // get video list
    router.get('/', ErrorHandler(this.getList))

    // play video
    router.post('/:id/play', ErrorHandler(this.startVideo))

    app.use('/api/videos', router)
  }

  async getList (req, res) {
    res.send(await Video.find({}))
  }

  async startVideo (req, res) {
    const video = await Video.findById(req.params.id)
    player.openFile(video.path)
    player.play()
    res.send({ message: `Playing ${video.name}` })
  }
}
