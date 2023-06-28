const usersModel = require("./models/user.model")

class UsersDaoMongo {

    constructor() {
        this.usersModel = usersModel
    }
    
    async getUsers() {
    
    }

    async getUserById(uid) {


    }

    async addUser(newUser) {

    }

    async updateUsert(uid, update) {
    
    }

    async deleteUser(uid) {


    }
}

module.exports = UsersDaoMongo