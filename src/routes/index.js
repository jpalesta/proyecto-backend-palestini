const {Router} = require ('express')
const router = Router ()

const productsRouter = require('./products.router.js')
const usersRouter = require('./users.router.js')
const cartsRouter = require('./carts.router.js')
const viewsRouter = require('./views.router.js')

//configuracion de routers
router.use('/api/products', productsRouter)
router.use('/api/users', usersRouter)
router.use('/api/carts', cartsRouter)
router.use('/', viewsRouter)

module.exports = router