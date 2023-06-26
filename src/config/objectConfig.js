const { connect } = require('mongoose')
require('dotenv').config()
dotenv = require ('dotenv')
const commander = require('commander')

const { mode } = commander.opts()

dotenv.config({
    path: mode === 'development' ? './.env.development' : '/env.production'
})


let url = process.env.URL_MONGO


module.exports = {
    privateKey: process.env.PRIVATE_KEY,
    connectDB: () => {
        connect(url)
        console.log('conectado a la BD ')
    }
}