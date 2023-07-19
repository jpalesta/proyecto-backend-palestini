const {Schema, model} = require ('mongoose')

const restorePassLinkCollection = 'restorePassLink'

const restorePassLinkSchema = new Schema({
    email: {
        type: String, required: true
    },
    createdAt: {
        type: Date,
        default: Date.now
    }
})

restorePassLinkSchema.index({ createdAt: 1 }, { expireAfterSeconds: 3600 });

const restorePassLinkModel = model(restorePassLinkCollection,restorePassLinkSchema)

module.exports = restorePassLinkModel