const { Schema, model } = require('mongoose')

const cartsCollection = 'carts'

const cartsSchema = new Schema({
    products: [{
        product: {type:Schema.Types.ObjectId, 
                        require: true,
                        ref: 'products'},
                        quantity: Number
    }]
})

const cartsModel = model(cartsCollection, cartsSchema)

module.exports = cartsModel