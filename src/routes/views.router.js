const { Router } = require('express')
const router = Router()

const {
    isAuthenticatedView,
} = require('../Middlewares/authentication.middlewares')

const { 
    passportAutorization 
} = require('../Middlewares/passportAutorization')

const { loginRedirect,
            viewAllProducts,
            viewOneCart,
            viewProductsRealtime,
            viewChat, viewFormCookies,
            viewRegister,
            viewLogin,
            viewRestorePass,
            viewMockingProducts 
        } = require('../controllers/views.controller')


//te redirecciona automáticamente al login
router.get('/', loginRedirect);

router.get('/products', isAuthenticatedView, viewAllProducts)

router.get('/cart/:cid', viewOneCart)

router.get('/realtimeproducts', passportAutorization('user'), viewProductsRealtime)

router.get('/chat', isAuthenticatedView, passportAutorization('user'), viewChat)

router.get('/formcookies', viewFormCookies)

router.get('/register', viewRegister)

router.get('/login', viewLogin)

router.get('/restorepass', viewRestorePass)

router.get('/mockingproducts', viewMockingProducts)

module.exports = router
