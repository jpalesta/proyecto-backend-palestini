const { connect } = require('mongoose')
const dotenv = require('dotenv')
const { program } = require('../utils/commander')
const { mode } = program.opts()

dotenv.config({
    path: mode === 'development' ? './.env.development' : './.env.production',
    mode: mode === 'development' ? 'development' : 'production',
})

let url = process.env.URL_MONGO

module.exports = {
    persistence: process.env.PERSISTENCE,
    loggerLevelConsole: process.env.LOGGER_LEVEL_CONSOLE,
    loggerLevelFile: process.env.LOGGER_LEVEL_FILE,
    mode: mode,
    privateKey: process.env.PRIVATE_KEY,
    connectDB: () => {
        connect(url)
    },
}
