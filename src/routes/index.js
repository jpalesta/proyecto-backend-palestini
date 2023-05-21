const {Router} = require ('express')
const router = Router ()

const productsRouter = require('./products.router.js')
const usersRouter = require('./users.router.js')
const cartsRouter = require('./carts.router.js')
const viewsRouter = require('./views.router.js')
const sessionsRouter = require('./sessions.router.js')

//configuracion de routers
router.use('/', viewsRouter)
router.use('/api/products', productsRouter)
router.use('/api/users', usersRouter)
router.use('/api/carts', cartsRouter)
router.use('/api/session', sessionsRouter)

module.exports = router