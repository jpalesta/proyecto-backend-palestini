const config = require('../config/objectConfig')


//no esta funcionando (VER log en app)

let UsersDao
let ProductsDao
let CartsDao
let TicketsDao


switch (config.persistence) {
    case 'MONGO':
        config.connectDB()
        const UsersDaoMongo = require('../dao/db/user.mongo')
        const ProductsDaoMongo = require('../dao/db/product.mongo')
        const CartsDaoMongo = require('../dao/db/cart.mongo')
        const TicketsDaoMongo = require('../dao/db/ticket.mongo')

        UsersDao = UsersDaoMongo
        ProductsDao = ProductsDaoMongo
        CartsDao = CartsDaoMongo
        TicketsDao = TicketsDaoMongo

        break;
    case 'FILE':
        UsersDaoFile = require('../dao/fileSystem/user.file')
        ProductsDaoFile = require('../dao/fileSystem/product.file')
        CartsDaoFile = require('../dao/fileSystem/cart.file')
        TicketsDaoFile = require('../dao/fileSystem/ticket.file')

        UsersDao = UsersDaoFile
        ProductsDao = ProductsDaoFile
        CartsDao = CartsDaoFile
        TicketsDao = TicketsDaoFile
        break;

    default:
        break
}

module.exports = {
    UsersDao,
    ProductsDao,
    CartsDao,
    TicketsDao
}