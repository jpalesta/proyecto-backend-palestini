class TicketDto {
    constructor(newTicket) {
        ;(this.code = newTicket.code), (this.amount = newTicket.amount)
        this.purchaser = newTicket.purchaser
    }
}

module.exports = TicketDto
