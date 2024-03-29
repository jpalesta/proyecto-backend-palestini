require('dotenv').config()
const bcrypt = require('bcryptjs')

const { generateToken } = require('../utils/jwt')
const { createHash } = require('../utils/bCryptHash')
const { logger } = require('../utils/logger')
const UserDto = require('../dto/user.dto')
const { sendMail } = require('../utils/sendMail')
const { usersService, restorePassLinksService } = require('../service')

class SessionController {
    register = async (req, res) => {
        try {
            let testUser = {
                optmessage:
                    'Tu usuario fue generado de manera exitosa, por favor logéate con tus nuevas credenciales',
            }
            res.render('login', testUser)
            logger.info('User register successfull')
        } catch (error) {
            logger.error(error)
        }
    }

    login = async (req, res) => {
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
                const actualDate = new Date()
                const dateConnection = { lastConnection: actualDate }
                const uid = user._id.toString()
                await usersService.updateById(uid, dateConnection)
                if (user.role === 'admin') {
                    res.redirect('/usersmaintenance')
                } else {
                    res.redirect('/products')
                }
            }
        } catch (error) {
            logger.error(error)
        }
    }

    current = (req, res) => {
        let user = req.user
        console.log(user);
        let userDto = new UserDto(user.user)
        console.log(userDto);
        res.send({
            message: 'Usuario actual',
            userDto,
        })
    }

    logout = async (req, res) => {
        try {
            const user = req.user
            const actualDate = new Date()
            const dateConnection = { lastConnection: actualDate }
            const uid = user.user._id.toString()
            await usersService.updateById(uid, dateConnection)
            res.clearCookie(process.env.JWT_COOKIE_NAME)
            logger.info('Logout successfull')
            res.redirect('/login')
        } catch (error) {
            logger.error(error)
            res.send({ Status: 'error', message: error })
        }
    }

    restorepass = async (req, res) => {
        const baseUrl = `${req.protocol}://${req.get('host')}`
        const { email } = req.body
        if (!email) {
            res.status(400).send({
                status: 'error',
                message: 'Please complete your email adress',
            })
        }
        const userDB = await usersService.getUser({ email })
        if (!userDB) {
            res.status(404).send({
                status: 'error',
                message:
                    'Username does not exist, please check your email or register',
            })
            return
        } else {
            const newRestorePassLink =
                await restorePassLinksService.createRestorePassLink(
                    userDB.email
                )

            const link = newRestorePassLink._id.toString()

            const to = email

            const mailSubject = 'Restablecer contraseña'

            const html = `Siga el siguiente enlace para restabler su contraseña:
            
            <a href="${baseUrl}/restorepasslink/${link}">Restablecer contraseña</a>`

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
                let testUser = {
                    link: link,
                    linkExpired:
                        'Tu link ha expirado, por favor solicita uno nuevo',
                }
                res.render('restorepass', testUser)
                logger.error('Invalid restore link or link has expired.')
                return
            }
            const email = validateLink.email
            const userDB = await usersService.getUser({ email })
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
                        passRepeated:
                            'No puedes usar la última contraseña utilizada, intenta nuevamente por favor',
                    }
                    res.render('restorePassLink', testUser)
                } else {
                    await restorePassLinksService.delete(link)
                    userDB.password = createHash(password)
                    await userDB.save()
                    let testUser = {
                        optmessage:
                            'Tu contraseña fue restaurada de manera exitosa, por favor logeate nuevamente',
                    }
                    res.render('login', testUser)
                    logger.info('your password was restored successfully')
                }
            })
        } catch (error) {
            logger.error(error)
        }
    }
}

module.exports = new SessionController()
