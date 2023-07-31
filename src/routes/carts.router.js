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

router.get('/', getAll)

router.get('/:cid', getOne)

router.post('/', create)

router.post(
    '/:cid/products/:pid',
    isAuthenticated,
    passportAutorization(['admin', 'premium']),
    update
)

router.delete('/:cid', deleteAll)

router.delete('/:cid/products/:pid', deleteProduct)

router.put('/:cid', updateProduct)

router.put('/:cid/products/:pid', updateProductQuantity)

router.post('/:cid/purchase', passportAuthentication('jwt'), purchase)

module.exports = router
