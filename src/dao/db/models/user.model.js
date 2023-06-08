const { Schema, model } = require('mongoose');

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
    dateOfBirth: {
        type: Date,
        require: false
    },
    role: {
        type: String,
        default: 'user'
    },
    password: {
        type: String,
        require: true
    },
    email: {
        type: String,
        require: true,
        unique: true
    },
    age: {
        type: Number
    },
    cart: {
        id: {
            type: Schema.Types.ObjectId,
            reference: 'carts'
        }
    }
})

usersSchema.pre('save', function (next) {
    if (this.dateOfBirth) {
        const currentDate = new Date()
        const age = currentDate.getFullYear() - this.dateOfBirth.getFullYear();
        this.age = age
    } else{
        this.dateOfBirth = ""
        this.age = ""
    }
    next()
})

const usersModel = model(usersCollection, usersSchema)

module.exports = { usersModel }