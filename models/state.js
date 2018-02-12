const mongoose = require('mongoose')
const Video = require('./video')

mongoose.Promise = global.Promise

const StateSchema = new mongoose.Schema({
  videoId: { type: mongoose.Schema.Types.ObjectId, ref: 'Video' },
  status: String
})

StateSchema.loadClass(
  class StateClass {
    static async get() {
      // TODO: usar esta forma cuando consigamos meter
      // mongod 3.4 en el server!
      //
      // const res = await this.aggregate([
      //   {
      //     $lookup: {
      //       from: 'videos',
      //       localField: 'videoId',
      //       foreignField: '_id',
      //       as: 'video'
      //     },
      //   },
      //   {
      //     $unwind: { path: '$video' }
      //   }
      // ])
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
      state.save()
    }
  }
)

module.exports = mongoose.model('State', StateSchema)

