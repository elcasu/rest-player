const mongoose = require('mongoose')
const Video = require('./video')

mongoose.Promise = global.Promise

const StateSchema = new mongoose.Schema({
  videoId: { type: mongoose.Schema.Types.ObjectId, ref: 'Video' },
  video: { type: Object },
  status: String
})

StateSchema.loadClass(
  class StateClass {
    static async get() {
      const res = await this.findOne({})
      if (res && res.videoId) {
        const video = await Video.findOne({ _id: res.videoId })
        res.video = video
      }
      return res
    }

    static async set(video, status) {
      let state = await this.findOne({})
      if (!state) {
        state = new this()
      }
      state.videoId = video._id
      state.status = status
      return state.save()
    }

    static async stop() {
      let state = await this.findOne({})
      if (!state) return
      state.status = 'STOPPED'
      state.videoId = undefined
      return state.save()
    }
  }
)

module.exports = mongoose.model('State', StateSchema)

