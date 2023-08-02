const { Schema, model } = require('mongoose')

const chatsCollection = 'messages'

const chatsSchema = new Schema({
    user: { type: String, required: true },
    message: { type: String, required: true },
})

const chatsModel = model(chatsCollection, chatsSchema)

module.exports = chatsModel
