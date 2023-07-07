const { usersService } = require('../service')
const { EErrors } = require('../utils/errors/enums')
const { generateUserInfo } = require('../utils/errors/info')
const { CustomError } = require('../utils/errors/CustomError')


class UserControler {

    getAll = async (req, res) => {
        try {
            let users = await usersService.get()
            res.send({ result: 'succes', payload: users })
        } catch (error) {
            console.log('Cannot get users with mongoose' + error)
        }
    }

    create = async (req, res, next) => {
        try {
            let { firstName, lastName, email, dateOfBirth, password } = req.body
            if (!firstName || !lastName || !email || !dateOfBirth || !password) {
                console.log('entró al error')
                CustomError.createError({
                    name: 'User Creation Error',
                    cause: generateUserInfo({ firstName, lastName, email, dateOfBirth, password }),
                    message: 'Error trying to create User',
                    code: EErrors.INVALID_TIPES_ERROR
                })
            } else {
                console.log('entró al else')
            let result = await usersService.create({
                firstName,
                lastName,
                email,
                password, 
                dateOfBirth
            })
            res.send({ status: 'success', payload: result })
        }
        } catch (error) {
            next(error)
        }
    }

}

module.exports = new UserControler