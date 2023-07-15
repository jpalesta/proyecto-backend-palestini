require('dotenv').config()

const { usersModel } = require('../dao/db/models/user.model')
const { generateToken } = require('../utils/jwt')
const { createHash } = require('../utils/bCryptHash')
const { logger } = require('../utils/logger')
const UserDto = require('../dto/user.dto')


class SessionController {

    register = async (req, res) => {
        try {
            logger.info('User register successfull')
            res.redirect('/login')
        } catch (error) {
            logger.error(error)
        }
    }

    login = (req, res) => {

        try {
            const { user } = req
            if (!user) {
                res.redirect('/register')
                logger.error(
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
            return logger.error(error)
        }
    }   

    current =  (req, res) => {
        let user = req.user
        console.log(user.user)
        let userDto = new UserDto (user)
        console.log(userDto)
        res.send({
            message: 'Usuario actual',
            userDto
        })
    }

    logout = async (req, res) => {
        try {
            res.clearCookie(process.env.JWT_COOKIE_NAME)
            logger.info('Logout successfull')
            res.redirect('/login')
        } catch (error) {
            logger.error(error)
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