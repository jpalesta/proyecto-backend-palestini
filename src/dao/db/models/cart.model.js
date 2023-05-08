const { Schema, model } = require('mongoose')

const cartsCollection = 'carts'

const cartsSchema = new Schema({
    products: {
        type: String
    }
})

const cartsModel = model(cartsCollection, cartsSchema)

module.exports = cartsModel