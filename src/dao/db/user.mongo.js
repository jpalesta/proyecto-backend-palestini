const usersModel = require("./models/user.model")

class UsersDaoMongo {

    constructor() {
        this.model = usersModel
    }
    
    getUsers = async () => {
        try{
            return await this.model.find()
        } catch(error){
            console.log('error en getUsers', error)
        }
    }
    
    getUser = async (uid) => {
        try{
            return await this.model.findOne()
        } catch(error){
            console.log('error en getUsers', error)
        }
    }

    createUser =  async (newUser) => {
        try {
            return await this.model.create(newUser)
        } catch(error){
            console.log('error en getUsers', error)
        }
    }

}

module.exports = UsersDaoMongo