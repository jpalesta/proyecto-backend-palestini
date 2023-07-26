const { Router } = require('express')
const router = Router()

const {
    getAll,
    getOne,
    create,
    update,
    deleteAll,
    updateProduct,
    deleteProduct,
    updateProductQuantity,
    purchase,
} = require('../controllers/carts.controller')

const { isAuthenticated } = require('../Middlewares/authentication.middlewares')
const { passportAutorization } = require('../Middlewares/passportAutorization')
const {
    passportAuthentication,
} = require('../Middlewares/passportAuthentication')

//Consulta de todos los corritos
router.get('/', getAll)

//Consulta de un carrito con Populate por id de producto
router.get('/:cid', getOne)

//Crea un carrito con productos pasados por body con validación
router.post('/', create)

//Agrega o incrementa un producto en un carrito, ambos pasan por params
router.post(
    '/:cid/products/:pid',
    isAuthenticated,
    passportAutorization(['admin', 'premium']),
    update
)

//Vacía un carrito por id
router.delete('/:cid', deleteAll)

//Borra un producto de un carrito por id de carrito e id de producto
router.delete('/:cid/products/:pid', deleteProduct)

//Actualiza un carrito por id con un producto por body  falta validación del body
router.put('/:cid', updateProduct)

//actualiza la cantidad de un producto de un carrito por id con cantidad por body falta validar body
router.put('/:cid/products/:pid', updateProductQuantity)

router.post('/:cid/purchase', passportAuthentication('jwt'), purchase)

module.exports = router
