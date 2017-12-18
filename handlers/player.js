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
    router.post('/:id/fwd', ErrorHandler(this.fwd))

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

  async fwd (req, res) {
    player.fwd30()
    res.send({ message: `Fwd 30 sec ${video.name}` })
  }
}
