const path = require('node:path')

const swaggerOptions = {
    definition: {
        openapi: '3.0.1',
        info: {
            title: 'Documentación del Ecommerce Jose.Palestini',
            description:
                'Esta es la documentación de uso y administración de un Ecommerce',
        },
    },
    // apis: [path.resolve(__dirname, `../../docs/**/*.yaml`)],
    //pregunta, cómo consigo tener la ruta relativa desde cualquier lugar
    apis: [
        path.resolve(
            'C:/Users/josep/proyecto-backend-palestini/src/docs/**/*.yaml'
        ),
    ],
}

module.exports = {
    swaggerOptions,
}
