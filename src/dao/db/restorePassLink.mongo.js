const restorePassLinkModel = require('./models/restopasslink.model')

class RestorePassLinkDaoMongo {
    constructor() {
        this.model = restorePassLinkModel
    }

    createRestorePassLink = async (email) => {
        try {
            return await this.model.create({ email })
        } catch (error) {
            return new Error(error)
        }
    }

    getOne = async (link) => {
        try {
            return await this.model.findById(link)
        } catch (error) {
            return new Error(error)
        }
    }

    delete = async (link) => {
        try {
            return await this.model.deleteOne({ _id: link })
        } catch (error) {
            return new Error(error)
        }
    }
}

module.exports = RestorePassLinkDaoMongo
