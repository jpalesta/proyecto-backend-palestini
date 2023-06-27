const { connect } = require('mongoose')
require('dotenv').config()
const {program} = require('../utils/commander')
const dotenv = require ('dotenv')

const { mode } = program.opts()
console.log('mode en config', mode)
dotenv.config({
    path: mode === 'development' ? './.env.development' : './.env.production'
})



let url = process.env.URL_MONGO

module.exports = {
    persistence : process.env.PERSISTENCE,
    privateKey: process.env.PRIVATE_KEY,
    connectDB: () => {
        connect(url)
        console.log('conectado a la BD ')
    }
}