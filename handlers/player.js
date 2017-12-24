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

    // get video info
    router.get('/info', ErrorHandler(this.info))

    // play video
    router.post('/:id/play', ErrorHandler(this.startVideo))

    // Controls
    router.post('/:id/back', ErrorHandler(this.back))
    router.post('/:id/fwd', ErrorHandler(this.fwd))
    router.post('/stop', ErrorHandler(this.stop))
    router.post('/:id/volUp', ErrorHandler(this.volUp))
    router.post('/:id/volDown', ErrorHandler(this.volDown))

    app.use('/api/videos', router)
  }

  async getList (req, res) {
    res.send(await Video.find({}))
  }

  async startVideo (req, res) {
    const video = await Video.findById(req.params.id)
    if (player && player.running) {
      player.quit()
    }
    player = Omx(video.path, 'hdmi', false, 100)
    res.send({ message: `Playing ${video.name}` })
  }

  async back (req, res) {
    const video = await Video.findById(req.params.id)
    player.back30()
    res.send({ message: `back 30 sec ${video.name}` })
  }

  async fwd (req, res) {
    const video = await Video.findById(req.params.id)
    player.fwd30()
    res.send({ message: `Fwd 30 sec ${video.name}` })
  }

  async stop (req, res) {
    if (player && player.running) {
      player.quit()
    }
    res.send({ message: `video stopped` })
  }

  async volUp (req, res) {
    const video = await Video.findById(req.params.id)
    player.volUp()
    res.send({ message: `${video.name} - volume up` })
  }

  async volDown (req, res) {
    const video = await Video.findById(req.params.id)
    player.volDown()
    res.send({ message: `${video.name} - volume down` })
  }

  async info (req, res) {
    if (!player) {
      return res.send({ message: 'player is not running' })
    }
    const info = player.info()
    res.send({ message: `player information`, info })
  }
}
