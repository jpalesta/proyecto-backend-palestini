const { Router } = require('express')
const express = require('express')

const router = Router()

const productsRouter = require('./products.router.js')
const usersRouter = require('./users.router.js')
const cartsRouter = require('./carts.router.js')
const viewsRouter = require('./views.router.js')
const sessionsRouter = require('./sessions.router.js')

const swaggerJsDoc = require('swagger-jsdoc')
const swaggerUiExpress = require('swagger-ui-express')

const { swaggerOptions } = require('../docs/swagger.js')

//configuracion de routers
router.use('/', viewsRouter)
router.use('/api/products', productsRouter)
router.use('/api/users', usersRouter)
router.use('/api/carts', cartsRouter)
router.use('/api/session', sessionsRouter)

//configuración de carpeta router
router.use('/static', express.static(__dirname + '../../public'))

//configuracion swagger
const specs = swaggerJsDoc(swaggerOptions)

//Pregunta, le puedo poner un middleware de autorización solo a admin?
router.use('/api/docs', swaggerUiExpress.serve, swaggerUiExpress.setup(specs))

//pregunta - esto está bien puesto acá?
router.get('*', async (req, res) => {
    res.status(404).send('Cannot get the specified route')
})

module.exports = router
