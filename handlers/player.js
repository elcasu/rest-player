const express = require('express')
const { ErrorHandler } = require('../middlewares')
const Video = require('../models/video')
const Omx = require('node-omxplayer')

let player
 
module.exports = class PlayerController {
  constructor (app) {
    const router = express.Router()

    // get video list
    router.get('/', ErrorHandler(this.getList))

    // play video
    router.post('/:id/play', ErrorHandler(this.startVideo))

    // Controls
    router.post('/:id/ff', ErrorHandler(this.fastForward))

    app.use('/api/videos', router)
  }

  async getList (req, res) {
    res.send(await Video.find({}))
  }

  async startVideo (req, res) {
    const video = await Video.findById(req.params.id)
    player = Omx(video.path, 'hdmi', false, 100)
    // player.openFile(video.path)
    // player.play()
    res.send({ message: `Playing ${video.name}` })
  }

  async fastForward (req, res) {
    player.fastFwd()
    res.send({ message: `FF ${video.name}` })
  }
}
