const { Router } = require('express')
const router = Router()

const {
    isAuthenticatedView,
} = require('../Middlewares/authentication.middlewares')

const { loginRedirect, viewAllProducts, viewOneCart, viewProductsRealtime, viewChat, viewFormCookies, viewRegister, viewLogin, viewRestorePass } = require('../controllers/views.controller');
const { authToken } = require('../utils/jwt');


//te redirecciona automáticamente al login
router.get('/',loginRedirect);

//chequeado OK
router.get('/products', authToken, viewAllProducts)

router.get('/cart/:cid', viewOneCart)

router.get('/realtimeproducts', viewProductsRealtime)

router.get('/chat', viewChat)

router.get('/formcookies', viewFormCookies)

router.get('/register', viewRegister)

router.get('/login', viewLogin)

router.get('/restorepass', viewRestorePass)

module.exports = router
