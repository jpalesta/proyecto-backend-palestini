const { connect } = require('mongoose')
require('dotenv').config()

let url = process.env.URL_MONGO


module.exports = {
    privateKey: process.env.PRIVATE_KEY,
    connectDB: () => {
        connect(url)
        console.log('conectado a la BD ')
    }
}