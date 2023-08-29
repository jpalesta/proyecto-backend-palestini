const path = require('path')

const swaggerOptions = {
    definition: {
        openapi: '3.0.1',
        info: {
            title: 'Documentación del Ecommerce Jose.Palestini',
            description:
                'Esta es la documentación de uso y administración de un Ecommerce',
        },
    },
    apis: [
        path.resolve(
            './**/*.yaml'
        ),
    ],
}

module.exports = {
    swaggerOptions,
}
