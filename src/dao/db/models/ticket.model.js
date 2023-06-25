const { Schema, model } = require('mongoose')

const ticketsCollection = 'tickets'

const ticketsSchema = new mongoose.Schema({
    code: {
        type: String,
        unique: true,
        required: true
    },
    purchase_datetime: {
        type: Date,
        default: Date.now,
        required: true
    },
    amount: {
        type: Number,
        required: true
    },
    purchaser: {
        type: String,
        required: true
    }
});


const ticketsModel = model(ticketsCollection, ticketsSchema)

module.exports = ticketsModel