const { usersService, cartsService } = require('../service')
const { logger } = require('../utils/logger')
const { EErrors } = require('../utils/errors/enums')
const { generateUserInfo } = require('../utils/errors/info')
const { CustomError } = require('../utils/errors/CustomError')


class UserControler {

    getAll = async (req, res) => {
        try {
            let users = await usersService.get()
            res.send({ result: 'succes', payload: users })
        } catch (error) {
            logger.error('Cannot get users with mongoose' + error)
        }
    }

    create = async (req, res, next) => {
        try {
            let { firstName, lastName, email, dateOfBirth, password } = req.body
            if (!firstName || !lastName || !email || !dateOfBirth || !password) {
                CustomError.createError({
                    name: 'User Creation Error',
                    cause: generateUserInfo({ firstName, lastName, email, dateOfBirth, password }),
                    message: 'Error trying to create User',
                    code: EErrors.INVALID_TIPES_ERROR
                })
            } else {
                const cart = await cartsService.createCart({ products: [] })
                let result = await usersService.create({
                    firstName,
                    lastName,
                    email,
                    password,
                    dateOfBirth,
                    cart: { id: cart._id }
                })
                res.send({ status: 'success', payload: result })
            }
        } catch (error) {
            next(error)
        }
    }

}

module.exports = new UserControler