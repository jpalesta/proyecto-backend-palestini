//implementar DTO de ticket

class TicketsRepository {
    constructor(dao) {
        this.dao = dao
    }

    createTicket(newTicket) {
        return this.dao.createTicket(newTicket)
    }
}

module.exports = TicketsRepository
