const { Router } = require('express')
// const { auth } = require('../middlewares/autenticacion.middleware')
const { usersModel } = require('../dao/db/models/user.model')

const router = Router()

//formulario de registro 
router.post('/register', async (req, res) => {
    try {
        const { firstName, lastName, email, dateOfBirth, password } = req.body
        console.log('req.body', req.body)
        if (!firstName || !lastName || !email || !dateOfBirth || !password) {
            res.status(400).send({
                status: 'error',
                message: 'all the fields must be complete'
            })
        }
        const existUser = await usersModel.findOne({ email })

        if (existUser) return res.send({ status: 'error', message: 'el email ya está registrado' })

        const newUser = {
            firstName,
            lastName,
            email,
            dateOfBirth,
            password  /// encriptar
        }
        let resultUser = await usersModel.create(newUser)
        res.redirect('/login')
        res.status(200).send({
            status: 'success',
            message: 'Usuario creado correctamente',
            resultUser
        })
    } catch (error) {
        console.log(error)
    }
})

router.post('/login', async (req, res) => {
    const { email, password } = req.body
    if (!email || !password) {
        res.status(400).send({
            status: 'error',
            message: 'all the fields must be complete'
        })
    }
    const userDB = await usersModel.findOne({ email, password })
    if (!userDB) {
        res.status(400).send({ 
            status: 'error', 
            message: 'Username or password is incorrect, please check your login information' 
        })
        return
    }
    req.session.user = {
        firstName: userDB.firstName,
        lastName: userDB.lastName,
        email: userDB.email,
    }
    res.redirect('/products')
})

router.get('/logout', (req, res) => {
    req.session.destroy(err => {
        if (err) {
            return res.send({ status: 'error', error: err })
        }
    })
    res.redirect('/login')
    console.log(res.session.user)
})

module.exports = router
