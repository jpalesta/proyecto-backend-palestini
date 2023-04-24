import mongoose from "mongoose"

const userCollection = 'usuarios'

const usersSchema = new mongoose.Schema({
    firstName: String,
    lastName: String,
    email:{
        type: String,
        unique: true
    }
})

export const userModel = monggose.model(userCollection, usersSchema)