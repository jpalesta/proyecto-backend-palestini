const { promises } = require('fs')
const fs = promises

class TicketsDaoFile {

    constructor() {
        this.tickets = []
        this.path = './assets/tickets.json'
    }

    read = async () => {
        try {
            const data = await fs.readFile(this.path, 'utf-8')
            this.tickets = JSON.parse(data)
            return this.tickets
        } catch (error) {
            this.tickets
        }
    }

    write = async () => {
        const tickets = JSON.stringify(this.tickets)
        await fs.writeFile(this.path, tickets)
    }

    createTicket = async (newTicket) => {

        await this.read()

        if (!newTicket.code ||
            !newTicket.purchase_datetime ||
            !newTicket.amount ||
            !newTicket.purchaser
        ) {
            throw 'all fields must be completed'
        }

        let ticket = this.tickets.find(ticket => ticket.code === newTicket.code)

        if (ticket) {
            throw 'This ticket already exist'
        }

        if (this.tickets.length === 0) {
            this.tickets.push({ id: 1, ...newTicket })
        } else {
            this.tickets.push({
                id: this.tickets[this.tickets.length - 1].id + 1, ...newTicket
            })
        }
        await this.write()
    }

}

module.exports = TicketsDaoFile;