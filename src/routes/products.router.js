const { Router } = require('express')
const router = Router()

const { isAuthenticated } = require('../Middlewares/authentication.middlewares.js')

const { getOne,
            create,
            update,
            deleteOne,
            getAllPaginate
} = require('../controllers/products.controller.js')

const { passportAutorization } = require('../Middlewares/passportAutorization.js')

//Trae todos los productos con pagination + querys 
router.get('/', isAuthenticated, getAllPaginate)

//Trae un producto por ID 
router.get('/:pid', getOne)

//Crea un producto por body chequeado con validación de body 
router.post('/', isAuthenticated ,passportAutorization(['admin', 'premium']), create)

//Modifica un producto por body  
router.put('/:pid', isAuthenticated ,passportAutorization(['admin', 'premium']), update)

//borra un producto por id 
router.delete('/:pid', isAuthenticated ,passportAutorization(['admin', 'premium']), deleteOne)

module.exports = router

