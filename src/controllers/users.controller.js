const { usersService, cartsService } = require('../service')
const { logger } = require('../utils/logger')
const { EErrors } = require('../utils/errors/enums')
const { generateUserInfo } = require('../utils/errors/info')
const { CustomError } = require('../utils/errors/CustomError')
const { createHash } = require('../utils/bCryptHash')
const path = require ('path')

class UserControler {
    getAll = async (req, res) => {
        try {
            console.log('dirnamedirecto', __dirname);
            const currentDir = path.dirname(__filename)
            const currentDirMod = path.join(currentDir, '../public/uploader')
            console.log('sin mod', currentDir);
            console.log('mod', currentDirMod);


            let users = await usersService.get()
            res.send({ result: 'success', payload: users })
        } catch (error) {
            logger.error('Cannot get users with mongoose' + error)
        }
    }

    create = async (req, res, next) => {
        try {
            let { firstName, lastName, email, dateOfBirth, password, role } =
                req.body
            if (
                !firstName ||
                !lastName ||
                !email ||
                !dateOfBirth ||
                !password
            ) {
                CustomError.createError({
                    name: 'User Creation Error',
                    cause: generateUserInfo({
                        firstName,
                        lastName,
                        email,
                        dateOfBirth,
                        password,
                    }),
                    message: 'Error trying to create User',
                    code: EErrors.INVALID_TIPES_ERROR,
                })
            } else {
                const cart = await cartsService.createCart({ products: [] })
                const passwordHashed = createHash(password)
                let result = await usersService.create({
                    firstName,
                    lastName,
                    email,
                    password: passwordHashed,
                    dateOfBirth,
                    cart: { id: cart._id },
                    role,
                })
                res.send({ status: 'success', payload: result })
            }
        } catch (error) {
            next(error)
        }
    }

    userDocsUpload = async (req, res) => {

    }

    roleChange = async (req, res, next) => {
        try {
            const uid = req.params.uid
            console.log('uid', uid)
            const currentUser = await usersService.getOne({ _id: uid })
            console.log('currentUser', currentUser)
            const currentUserRole = currentUser.role
            console.log('currentUserRole', currentUserRole)

            if (!currentUserRole) {
                logger.error('Cannot get users with mongoose')
            }
            if (currentUserRole === 'user') {
                currentUser.role = 'premium'
                await currentUser.save()
                logger.info('The user role was changed to Premium')
            } else if (currentUserRole === 'premium') {
                currentUser.role = 'user'
                await currentUser.save()
                logger.info('The user role was changed to User')
            } else {
                logger.error('The user role was not changed')
            }
        } catch (error) {
            next(error)
        }
    }
}

module.exports = new UserControler()
