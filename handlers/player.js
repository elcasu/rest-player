const fs = require('fs')
const express = require('express')
const multer = require('multer')
const { ErrorHandler } = require('../middlewares')
const Video = require('../models/video')
const State = require('../models/state')
const playerManager = require('../helpers/playerManager')
const { generateError } = require('../helpers/errors')

let player

const upload = multer({ dest: '/tmp' })
const imageDir = 'img'
 
module.exports = class PlayerController {
  constructor (app) {
    const router = express.Router()

    // get video list
    router.get('/', ErrorHandler(this.getList))

    // get video
    router.get('/:id', ErrorHandler(this.getVideo))

    // update video
    router.put('/:id', upload.single('image'), ErrorHandler(this.updateVideo))

    // get video info
    router.get('/info', ErrorHandler(this.info))

    // play video
    router.post('/:id/play', ErrorHandler(this.startVideo))

    // Controls
    router.post('/:id/back', ErrorHandler(this.back))
    router.post('/:id/fwd', ErrorHandler(this.fwd))
    router.post('/stop', ErrorHandler(this.stop))
    router.post('/volUp', ErrorHandler(this.volUp))
    router.post('/volDown', ErrorHandler(this.volDown))

    app.use('/api/videos', router)

  }

  async getList (req, res) {
    const videos = await Video.find({})
    res.send({
      videos,
      state: await State.get()
    })
  }

  async getVideo (req, res) {
    const video = await Video.findById(req.params.id)
    res.send(video)
  }

  async updateVideo (req, res) {
    const video = await Video.findById(req.params.id)
    if (!video) {
      throw generateError(404, 'Video not found')
    }
    if (req.file) {
      // copy image from tmp dir
      const filePath = `${imageDir}/${video._id}`
      fs.createReadStream(req.file.path).pipe(fs.createWriteStream(`public/${filePath}`))
      video.image = {}
      video.image.name = req.file.originalname
      video.image.path = req.file.path
      video.image.url = `${req.get('host')}/${filePath}`
    }
    video.name = req.body.name
    await video.save()
    res.send(video)
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
    playerManager.volUp()
    res.send({ message: 'volume up' })
  }

  async volDown (req, res) {
    playerManager.volDown()
    res.send({ message: 'volume down' })
  }

  async info (req, res) {
    if (!player || !player.running) {
      return res.send({ message: 'player is not running' })
    }
    const info = player.info()
    res.send({ message: info })
  }
}
