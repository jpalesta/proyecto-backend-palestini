const { Router } = require('express')
// const { auth } = require('../middlewares/autenticacion.middleware')
const { usersModel } = require('../dao/db/models/user.model')

const { createHash, isValidPassword } = require('../utils/bCryptHash')
const passport = require('passport')

const router = Router()

//formulario de registro y login sin passport
// router.post('/register', async (req, res) => {
//     try {
//         const { firstName, lastName, email, dateOfBirth, password } = req.body
//         console.log('req.body', req.body)
//         if (!firstName || !lastName || !email || !dateOfBirth || !password) {
//             res.status(400).send({
//                 status: 'error',
//                 message: 'all the fields must be complete'
//             })
//         }
//         const existUser = await usersModel.findOne({ email })

//         if (existUser) return res.send({ status: 'error', message: 'el email ya está registrado' })

//         const newUser = {
//             firstName,
//             lastName,
//             email,
//             dateOfBirth,
//             password: createHash(password)
//         }
//         let resultUser = await usersModel.create(newUser)
//         res.redirect('/login')
//         // res.status(200).send({
//         //     status: 'success',
//         //     message: 'Usuario creado correctamente',
//         //     resultUser
//         // })
//     } catch (error) {
//         console.log(error)
//     }
// })
// router.post('/login', async (req, res) => {
//     const { email, password } = req.body
//     if (!email || !password) {
//         res.status(400).send({
//             status: 'error',
//             message: 'all the fields must be complete'
//         })
//     }
//     const userDB = await usersModel.findOne({ email })
//     if (!userDB) {
//         res.status(404).send({
//             status: 'error',
//             message: 'Username does not exist, please check your login information'
//         })
//         return
//     }
//     if (!isValidPassword(password, userDB)) {
//         res.status(401).send({
//             status: 'error',
//             message: 'Incorrect password, please check your login information'
//         })
//     }
//     req.session.user = {
//         firstName: userDB.firstName,
//         lastName: userDB.lastName,
//         email: userDB.email,
//     }
//     let userLoged = req.session.user

//     if (!userLoged) {
//         userLoged = {
//             firstName: null,
//             lastName: null
//         }
//         logedUserRole = ''
//     } else {
//         //validación manual de usuario admin
//         if (req.session.user.email === 'adminCoder@coder.com') {
//             logedUserRole = 'admin'
//         } else {
//             logedUserRole = 'user'
//         }
//         req.session.user.role = logedUserRole
//     }
//     res.redirect('/products')
// })

router.get('/logout', (req, res) => {
    req.session.destroy(err => {
        if (err) {
            return res.send({ status: 'error', error: err })
        }
    })
    res.redirect('/login')
})

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

//registro con passport github
router.get('/github', passport.authenticate('github', { scope: ['user: email'] }))
router.get('/githubcallback', passport.authenticate('github', { failureRedirect: '/login' }), async (req, res) => {
    req.session.user = req.user
    res.redirect('/products')
})

//registro con local passport
router.post('/register', passport.authenticate('register', { failureRedirect: '/failregister' }), async (req, res) => {
    res.redirect('/login')
    console.log('User registered')
})
router.get('/failregister', async (req, res) => {
    console.log('Failed strategy')
    res.send({ error: 'Failed' })
})

//login con local passport
router.post('/login', passport.authenticate('login', { failureRedirect: '/faillogin' }), async (req, res) => {
    if (!req.user) return res.status(401).send({ status: 'error', error: 'Invalid credentials' })
    req.session.user = {
        firstName: req.user.firstName,
        lastName: req.user.lastName,
        dateOfBirth: req.user.dateOfBirth,
        email: req.user.email
    }
    if (req.session.user.email === 'adminCoder@coder.com') {
        logedUserRole = 'admin'
    } else {
        logedUserRole = 'user'
    }
    req.session.user.role = logedUserRole
    res.redirect('/products')
})
router.get('/faillogin', async (req, res) => {
    console.log('Failed strategy')
    res.send({ error: 'Failed login' })
})

module.exports = router