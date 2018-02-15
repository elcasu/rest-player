const express = require('express')
const { ErrorHandler } = require('../middlewares')
const Video = require('../models/video')
const State = require('../models/state')
const playerManager = require('../helpers/playerManager')

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
    const videos = await Video.find({})
    res.send({
      videos,
      state: await State.get()
    })
  }

  async startVideo (req, res) {
    const video = await Video.findById(req.params.id)
    await playerManager.start(video, req.socket)
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
    await playerManager.stop(req.socket)
    res.send({ message: 'video stopped' })
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
    if (!player || !player.running) {
      return res.send({ message: 'player is not running' })
    }
    const info = player.info()
    res.send({ message: info })
  }
}
