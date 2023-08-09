const { ProductsDao } = require('../dao/factory')
const ProductRepository = require('../repositories/products.repository')
const productsService = new ProductRepository(new ProductsDao())

const { UsersDao } = require('../dao/factory')
const UsersRepository = require('../repositories/user.repository')
const usersService = new UsersRepository(new UsersDao())

const { CartsDao } = require('../dao/factory')
const CartRepository = require('../repositories/carts.repository')
const cartsService = new CartRepository(new CartsDao())

const { TicketsDao } = require('../dao/factory')
const TicketRepository = require('../repositories/tickets.repository')
const ticketsService = new TicketRepository(new TicketsDao())

const { RestorePassLinkDao } = require('../dao/factory')
const ResorePassLinkRepository = require('../repositories/restorePassLink.repository')
const restorePassLinksService = new ResorePassLinkRepository(new RestorePassLinkDao())

module.exports = {
    usersService,
    productsService,
    cartsService,
    ticketsService,
    restorePassLinksService
}
