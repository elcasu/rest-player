const PlayerHandler = require('./player')

module.exports = app => {
  new PlayerHandler(app)
}
