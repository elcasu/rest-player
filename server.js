require('dotenv').config()
const mongoose = require('mongoose')
const cors = require('cors')
const express = require('express')
const app = express()
const bodyParser = require('body-parser')
const path = require('path')
const handlers = require('./handlers')

app.use(cors())
app.use(bodyParser.json())
app.use(bodyParser.urlencoded({ extended: true }))
app.use(express.static(path.join(__dirname, "/public")))

if (!mongoose.connection.readyState) {
  mongoose.connect(process.env.DATABASE_NAME, { useMongoClient: true })
  mongoose.set('debug', (!process.env.NODE_ENV || process.env.NODE_ENV === 'development'))
}

handlers(app)

const port = process.env.PORT || 7000
app.listen(port, () => {
  if (process.env.NODE_ENV !== 'test'){
    //eslint-disable-next-line no-console
    console.log("Server running on port " + port);
  }
})
