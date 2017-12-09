require('dotenv').config()
const mongoose = require('mongoose')
const { importList } = require('./helpers/videoImporter')
const dir = process.argv[2] || process.env.VIDEOS_PATH

mongoose.connect(process.env.DATABASE_NAME, { useMongoClient: true })

if (!dir) {
  throw new Error('no video path defined')
}

(async () => {
  //eslint-disable-next-line no-console
  console.log('importing...')
  await importList(dir)
  //eslint-disable-next-line no-console
  console.log('done!')
})()
