const { Router } = require('express')
const router = Router()
const passport = require('passport')

const { usersModel } = require("../dao/db/models/user.model")

const { login, register, current, logout, restorepass, githubCallback, pruebaLogin, pruebaRegister 
} = require('../controllers/sessions.controller')
const { passportAutorization} = require('../Middlewares/passportAutorization')
const {passportAuthentication} = require('../Middlewares/passportAuthentication')
const {createHash} = require('../utils/bCryptHash')

router.post('/login', passport.authenticate('login',{failureRedirect:'/faillogin', session:false,}) , login)

router.get('/faillogin', async (req, res) => {
    console.log('Failed login strategy')
    res.send({error: 'Failed'})
})

router.post('/register', passport.authenticate('register',{failureRedirect:'/failregister', session:false,}) , register)

router.get('/failregister', async (req, res) => {
    console.log('Failed register strategy')
    res.send({error: 'Failed'})
})








//registro con passport github
router.get(
    '/github',
    passport.authenticate('github', { scope: ['user: email'], session: false })
)
router.get(
    '/githubcallback',
    passport.authenticate('github', {
        failureRedirect: '/login',
        session: false,
    }), async (req, res) => {
    req.cookies.user = req.user
    console.log('req en guthub', req.cookies.user);
    res.redirect('/products')
})

router.get('/logout', logout )

router.post('/restorepass', async (req, res) => {
    const { email, password } = req.body
    if (!email || !password) {
        res.status(400).send({
            status: 'error',
            message: 'all the fields must be complete'
        })
    }
    const userDB = await usersModel.findOne({ email })
    if (!userDB) {
        res.status(404).send({
            status: 'error',
            message: 'Username does not exist, please check your login information'
        })
        return
    } else {
        userDB.password = createHash(password)
        await userDB.save()
        res.redirect('/login')
    }
})


///current arroja info del usuario actual
router.get('/current',
    passportAuthentication('jwt'),
    passportAutorization('user'),
    (req, res) => {
        let currentUser = req.user
        res.send({
            message: 'Usuario actual',
            currentUser
        })
    }
    )

module.exports = router