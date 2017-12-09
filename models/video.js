const mongoose = require('mongoose')

mongoose.Promise = global.Promise

const VideoSchema = new mongoose.Schema({
  name: { type: String, required: 'video name is required' },
  path: { type: String, required: 'video path is required' }
})

module.exports = mongoose.model('Video', VideoSchema)
