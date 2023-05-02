const {Schema, model} = require ('mongoose')

const usersCollection = 'users'

const usersSchema = new Schema({
    firstName: {
        type: String,
        require: true
    },
    lastName: {
        type: String,
        require: true
    },
    email: {
        type: String,
        require: true,
        unique: true
    }
})

const usersModel = model(usersCollection,usersSchema)

module.exports = usersModel