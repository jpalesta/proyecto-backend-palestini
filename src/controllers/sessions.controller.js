require('dotenv').config()

const { usersModel } = require('../dao/db/models/user.model')
const { generateToken } = require('../utils/jwt')
const { createHash, isValidPassword } = require('../utils/bCryptHash')

class SessionController {

    register = async (req, res) => {
        try {
            console.log('User register successfull')
            res.redirect('/login')
        } catch (error) {
            console.log(error)
        }
    }

    login = (req, res) => {

        try {
            const { user } = req
            if (!user) {
                res.redirect('/register')
                console.log(
                    'The mail provided doesn´t exist, please check the information or register'
                )
            } else {
                const token = generateToken(user)
                res.cookie(process.env.JWT_COOKIE_NAME, token, {
                    maxAge: 60 * 60 * 10000,
                    httpOnly: true,
                })
                res.redirect('/products')

            }
        } catch (error) {
            return console.log(error)
        }
    }   

    current =  (req, res) => {
        let currentUser = req.user
        res.send({
            message: 'Usuario actual',
            currentUser
        })
    }

    logout = async (req, res) => {
        try {
            res.clearCookie(process.env.JWT_COOKIE_NAME)
            console.log('Logout successfull')
            res.redirect('/login')
        } catch (error) {
            console.log(error)
            res.send({ Status: 'error', message: error })
        }
    }

    restorepass = async (req, res) => {
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
    }
}

module.exports = new SessionController