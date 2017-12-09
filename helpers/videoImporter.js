const fs = require('fs')
const { promisify } = require('util')
const readDir = promisify(fs.readdir)
const Video = require('../models/video')

module.exports = {
  importList: async (dir) => {
    const files = await readDir(dir)
    let i = 1
    for (let f of files) {
      const fullPath = `${process.env.VIDEOS_PATH}/${f}`
      let video = await Video.find({ path: fullPath })
      if (!video.length) {
        video = new Video({
          name: `video ${i}`, // TODO: ask for a name or something
          path: fullPath
        })
        await video.save()
        i++
      }
    }
  }
}
