const ticketsModel = require('./models/ticket.model')

class TicketsDaoMongo {
    constructor() {
        this.model = ticketsModel
    }

    createTicket = async (newTicket) => {
        try {
            return await this.model.create(newTicket)
        } catch (error) {
            return new Error(error)
        }
    }
}

module.exports = TicketsDaoMongo
