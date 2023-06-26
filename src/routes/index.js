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

//pregunta - esto está bien puesto acá?
router.get('*', async(req, res) =>{
    res.status(404).send('Cannot get the specified route')
})

module.exports = router