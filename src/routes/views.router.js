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
            viewRestorePassLink,
            viewMockingProducts 
        } = require('../controllers/views.controller')

//ruta de prueba de logs
router.get('/loggertest', (req, res) => {
    req.logger.fatal('Este es un mensaje de nivel fatal')
    req.logger.error('Este es un mensaje de nivel error')
    req.logger.warning('Este es un mensaje de nivel warning')
    req.logger.info('Este es un mensaje de nivel info')
    req.logger.http('Este es un mensaje de nivel http')
    req.logger.debug('Este es un mensaje de nivel debug')
    res.send({
        status: 200,
        message: 'Prueba de loggers'
    })
});


//te redirecciona automáticamente al login
router.get('/', loginRedirect);

router.get('/products', isAuthenticatedView, viewAllProducts)

router.get('/cart/:cid', viewOneCart)

router.get('/realtimeproducts', viewProductsRealtime)

router.get('/chat', isAuthenticatedView, passportAutorization('user'), viewChat)

router.get('/formcookies', viewFormCookies)

router.get('/register', viewRegister)

router.get('/login', viewLogin)

router.get('/restorepass', viewRestorePass)

router.get('/restorepassLink/:link', viewRestorePassLink)

router.get('/mockingproducts', viewMockingProducts)

module.exports = router
