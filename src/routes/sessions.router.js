const { Router } = require('express')
const router = Router()
const passport = require('passport')
require('dotenv').config()

const {
    login,
    register,
    current,
    logout,
    restorepass,
    restorePassLink,
} = require('../controllers/sessions.controller')

const { passportAutorization } = require('../Middlewares/passportAutorization')

const {
    passportAuthentication,
} = require('../Middlewares/passportAuthentication')

const { generateToken } = require('../utils/jwt')

const { logger } = require('../utils/logger')

router.post(
    '/login',
    passport.authenticate('login', {
        failureRedirect: '/faillogin',
        session: false,
    }),
    login
)

router.get('/faillogin', async (req, res) => {
    logger.error('Failed login strategy')
    res.send({ error: 'Failed' })
})

router.post(
    '/register',
    passport.authenticate('register', {
        failureRedirect: '/failregister',
        session: false,
    }),
    register
)

router.get('/failregister', async (req, res) => {
    logger.error('Failed register strategy')
    res.send({ error: 'Failed' })
})

router.get(
    '/github',
    passport.authenticate('github', { scope: ['user: email'], session: false })
)

router.get(
    '/githubcallback',
    passport.authenticate('github', {
        failureRedirect: '/login',
        session: false,
    }),
    async (req, res) => {
        const user = req.user
        const token = generateToken(user)
        res.cookie(process.env.JWT_COOKIE_NAME, token, {
            maxAge: 60 * 60 * 10000,
            httpOnly: true,
        })
        res.redirect('/products')
    }
)

router.get(
    '/logout',
    passportAuthentication('jwt'),
    passportAutorization(['user', 'admin', 'premium']),
    logout
)

router.post('/restorepass', restorepass)

router.post('/restorepasslink/:link', restorePassLink)

router.get(
    '/current',
    passportAuthentication('jwt'),
    passportAutorization('user','admin', 'premium'),
    current
)

module.exports = router
