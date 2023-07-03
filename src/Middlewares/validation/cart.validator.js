const Ajv = require('ajv')

const cartsSchema = {
    type: 'object',
    properties: {
        products: {
            type: 'array',
            items: {
                type: 'object',
                properties: {
                    product: { type: 'string', minLength: 24 }, // Utilizar 'string' en lugar de 'ObjectId' OJO 
                    quantity: { type: 'number' }
                },

            }
        }
    },
    required: ['products']
}

const ajv = new Ajv()
const cartValidate = ajv.compile(cartsSchema)

module.exports = cartValidate