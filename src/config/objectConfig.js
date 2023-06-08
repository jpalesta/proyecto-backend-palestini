const { connect } = require('mongoose')

let url = 'mongodb+srv://josepalestini:48648332@cluster0.x8zgzdu.mongodb.net/?retryWrites=true&w=majority'

module.exports = {
    privateKey: 'LLAVEpRIVADA',
    connectDB: () => {
        connect(url)
        console.log('conectado a la BD ')
    }
}