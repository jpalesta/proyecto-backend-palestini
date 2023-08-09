const config = require('../config/objectConfig')
const { logger } = require('../utils/logger')

let UsersDao
let ProductsDao
let CartsDao
let TicketsDao
let RestorePassLinkDao

switch (config.persistence) {
    case 'MONGO':
        config.connectDB()
        logger.info('Conectado a la BD')
        const UsersDaoMongo = require('../dao/db/user.mongo')
        const ProductsDaoMongo = require('../dao/db/product.mongo')
        const CartsDaoMongo = require('../dao/db/cart.mongo')
        const TicketsDaoMongo = require('../dao/db/ticket.mongo')
        const RestorePassLinkDaoMongo = require('../dao/db/restorePassLink.mongo')

        UsersDao = UsersDaoMongo
        ProductsDao = ProductsDaoMongo
        CartsDao = CartsDaoMongo
        TicketsDao = TicketsDaoMongo
        RestorePassLinkDao = RestorePassLinkDaoMongo

        break
    case 'FILE':
        const UsersDaoFile = require('../dao/fileSystem/user.file')
        const ProductsDaoFile = require('../dao/fileSystem/product.file')
        const CartsDaoFile = require('../dao/fileSystem/cart.file')
        const TicketsDaoFile = require('../dao/fileSystem/ticket.file')
        const RestorePassLinkFile = require('../dao/fileSystem/restoresPassLink.file')

        UsersDao = UsersDaoFile
        ProductsDao = ProductsDaoFile
        CartsDao = CartsDaoFile
        TicketsDao = TicketsDaoFile
        RestorePassLinkDao = RestorePassLinkFile
        break

    default:
        break
}

module.exports = {
    UsersDao,
    ProductsDao,
    CartsDao,
    TicketsDao,
    RestorePassLinkDao
}
