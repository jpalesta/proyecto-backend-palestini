const { Schema, model } = require('mongoose')

const cartsCollection = 'carts'

const cartsSchema = new Schema({
    products: [{
        type: Schema.Types.ObjectId,
        // ref: products
    }],
    quantity: {
        type: Number
    }
})

const cartsModel = model(cartsCollection, cartsSchema)

module.exports = cartsModel