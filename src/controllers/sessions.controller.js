require('dotenv').config()

const { generateToken } = require('../utils/jwt')
const { createHash } = require('../utils/bCryptHash')
const { logger } = require('../utils/logger')
const UserDto = require('../dto/user.dto')
const { sendMail } = require('../utils/sendMail')
const { usersService } = require('../service')


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
        const { email } = req.body
        if ( !email ) {
            res.status(400).send({
                status: 'error',
                message: 'Please complete your email adress'
            })
        }
        const userDB = await usersService.getOne({ email })
        if (!userDB) {
            res.status(404).send({
                status: 'error',
                message: 'Username does not exist, please check your email or register'
            })
            return
        } else {

            const to = email

            const mailSubject = 'Restablecer contraseña'

            const html = `Siga el siguiente enlace para restabler su contraseña:
            
            <a href="http://localhost:8080/api/session/restorepasssteptwo">Restablecer contraseña</a>`

            await sendMail(to, mailSubject, html)
            // userDB.password = createHash(password)
            // await userDB.save()
            res.redirect('/login')
        }
    }
}

module.exports = new SessionController