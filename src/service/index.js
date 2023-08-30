const { ProductsDao } = require('../dao/factory')
const ProductRepository = require('../repositories/products.repository')
const productsService = new ProductRepository(ProductsDao)

const { UsersDao } = require('../dao/factory')
const UsersRepository = require('../repositories/user.repository')
const usersService = new UsersRepository(UsersDao)

const { CartsDao } = require('../dao/factory')
const CartRepository = require('../repositories/carts.repository')
const cartsService = new CartRepository( CartsDao)

const { TicketsDao } = require('../dao/factory')
const TicketRepository = require('../repositories/tickets.repository')
const ticketsService = new TicketRepository(TicketsDao)

const { RestorePassLinkDao } = require('../dao/factory')
const ResorePassLinkRepository = require('../repositories/restorePassLink.repository')
const restorePassLinksService = new ResorePassLinkRepository(RestorePassLinkDao)

module.exports = {
    usersService,
    productsService,
    cartsService,
    ticketsService,
    restorePassLinksService
}
