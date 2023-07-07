const { Schema, model } = require('mongoose');

const usersCollection = 'users'

const usersSchema = new Schema({
    firstName: {
        type: String, required: true
    },
    lastName: {
        type: String, required: true
    },
    dateOfBirth: {
        type: Date, required: false
    },
    role: {
        type: String, default: 'user'
    },
    password: {
        type: String, required: true
    },
    email: {
        type: String, required: true, unique: true
    },
    cart: {
        id: {
            type: Schema.Types.ObjectId, ref: 'carts',
            required: true
        },
    },
    age: {
        type: Number
    }
})

usersSchema.pre('save', function (next) {
    if (this.dateOfBirth) {
        const currentDate = new Date()
        const age = currentDate.getFullYear() - this.dateOfBirth.getFullYear();
        this.age = age
    } else {
        this.dateOfBirth = ""
        this.age = ""
    }
    next()
})

const usersModel = model(usersCollection, usersSchema)

module.exports = usersModel 