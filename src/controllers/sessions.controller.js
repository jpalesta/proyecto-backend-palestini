require('dotenv').config()
const bcrypt = require('bcrypt')

const { generateToken } = require('../utils/jwt')
const { createHash } = require('../utils/bCryptHash')
const { logger } = require('../utils/logger')
const UserDto = require('../dto/user.dto')
const { sendMail } = require('../utils/sendMail')
const { usersService, restorePassLinksService } = require('../service')

class SessionController {
    register = async (req, res) => {
        try {
            logger.info('User register successfull')
            res.redirect('/login')
        } catch (error) {
            console.log('error en register', error);
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
            console.log('error en login', error);
            logger.error(error)

        }
    }

    current = (req, res) => {
        let user = req.
        console.log('user en current', user);
        let userDto = new UserDto(user)
        res.send({
            message: 'Usuario actual',
            userDto,
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
        if (!email) {
            res.status(400).send({
                status: 'error',
                message: 'Please complete your email adress',
            })
        }
        const userDB = await usersService.getOne({ email })
        if (!userDB) {
            res.status(404).send({
                status: 'error',
                message:
                    'Username does not exist, please check your email or register',
            })
            return
        } else {
            const newRestorePassLink =
                await restorePassLinksService.createRestorePassLink(userDB.email)

            const link = newRestorePassLink._id.toString()

            const to = email

            const mailSubject = 'Restablecer contraseña'

            const html = `Siga el siguiente enlace para restabler su contraseña:
            
            <a href="http://localhost:8080/restorepasslink/${link}">Restablecer contraseña</a>`

            await sendMail(to, mailSubject, html)

            res.redirect('/login')
        }
    }

    restorePassLink = async (req, res, next) => {
        const { link } = req.params
        const { password } = req.body
        try {
            if (!password) {
                res.status(400).send({
                    status: 'error',
                    message: 'Please complete the new password',
                })
            }
            const validateLink = await restorePassLinksService.getOne(link)
            if (!validateLink) {
                res.redirect('/restorepass')
                logger.error('Invalid restore link or link has expired.')
                return
            }
            const email = validateLink.email
            const userDB = await usersService.getOne({ email })
            bcrypt.compare(password, userDB.password, async (error, result) => {
                if (error) {
                    logger.error(
                        'An error occurred during the password comparison'
                    )
                    return
                }
                if (result) {
                    logger.info('You can´t use the same password')
                    let testUser = {
                        link: link,
                        passRepeated: 'No puedes usar la última contraseña utilizada, intenta nuevamente por favor'
                    }
                    res.render('restorePassLink', testUser)
                } else {
                    await restorePassLinksService.delete(link)
                    userDB.password = createHash(password)
                    await userDB.save()
                    logger.info('your password was restored successfully')
                    res.redirect('/login')
                }
            })
        } catch (error) {
            logger.error(error)
        }
    }
}

module.exports = new SessionController()
