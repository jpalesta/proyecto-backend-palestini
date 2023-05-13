const {Schema, model} = require ('mongoose')
const mongoosePaginate = require ('mongoose-paginate-v2')
const productsCollection = 'products'

const productsSchema = new Schema({
    title: {type: String, require: true},
    description: {type: String, require: true},
    price: {type: Number, require: true},
    thumbnail: String,
    code: {type: String, require: true, unique: true},
    stock: {type: Number, require: true},
    category: {type: String, require: true},
    status: {type: Boolean,require: true}
})
productsSchema.plugin(mongoosePaginate)
const productsModel = model(productsCollection,productsSchema)

module.exports = productsModel