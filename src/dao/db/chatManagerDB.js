const chatsModel = require("./models/chat.model")


class ChatManagerDB {

    async getmessages() {
        try {
            return await chatsModel.find({})
        } catch (error) {
            return new Error(error)
        }
    }

    async addMessage(newMessage) {
        try {
            await chatsModel.create(newMessage)
        } catch (error) {
            return new Error(error)
        }
    }
}

module.exports = new ChatManagerDB