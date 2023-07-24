const Ajv = require('ajv')

const productSchema = {
    type: 'object',
    properties: {
        title: { type: 'string' },
        description: { type: 'string' },
        price: { type: 'number' },
        thumbnail: { type: 'string' },
        code: { type: 'string' },
        stock: { type: 'number' },
        category: { type: 'string' },
        status: { type: 'boolean' },
    },
    required: ['title', 'description', 'price', 'code', 'stock', 'category', 'status']
}

const ajv = new Ajv()
const productValidate = ajv.compile(productSchema)

module.exports = productValidate