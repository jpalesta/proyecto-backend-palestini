const usersModel = require('./models/user.model')
const { logger } = require('../../utils/logger')

class UsersDaoMongo {
    constructor() {
        this.model = usersModel
    }

    getUsers = async () => {
        try {
            return await this.model.find()
        } catch (error) {
            logger.error('error en getUsers', error)
        }
    }

    getUser = async (uid) => {
        try {
            return await this.model.findOne(uid)
        } catch (error) {
            logger.error('error en getUsers', error)
        }
    }

    createUser = async (newUser) => {
        try {
            return await this.model.create(newUser)
        } catch (error) {
            logger.error('error en createUser', error)
        }
    }

    deleteUser = async (email) => {
        try {
            const deletedUser = await this.model.deleteOne(email)
            return deletedUser
        } catch (error) {
            logger.error('error en deleteUser', error)
        }
    }
}

module.exports = UsersDaoMongo
