const { Schema, model } = require('mongoose')

const cartsCollection = 'carts'

const cartsSchema = new Schema({
    products: [
        {
            product: {
                type: Schema.Types.ObjectId,
                ref: 'products',
            },
            quantity: {
                type: Number,
                default: 1,
            },
        },
    ],
})

const cartsModel = model(cartsCollection, cartsSchema)

module.exports = cartsModel
