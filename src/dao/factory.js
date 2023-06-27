const config = require('../config/objectConfig')


//no esta funcionando (VER log en app)

let UsersDao
let ProductsDao
let CartsDao


switch (config.persistence) {
    case 'MONGO':
        config.connectDB()
        const UsersDaoMongo = require('../dao/db/user.mongo')
        const ProductsDaoMongo = require('../dao/db/product.mongo')
        const CartstsDaoMongo = require('../dao/db/cart.mongo')

        UsersDao = UsersDaoMongo
        ProductsDao = ProductsDaoMongo
        CartsDao = CartstsDaoMongo

        break;
    case 'FILE':
        UsersDaoFile = require('../dao/fileSystem/user.file')
        ProductsDaoFile = require('../dao/fileSystem/product.file')
        CartsDaoFile = require('../dao/fileSystem/cart.file')

        UsersDao = UsersDaoFile
        ProductsDao = ProductsDaoFile
        CartsDao = CartsDaoFile
        break;

    default:
        break
}

module.exports = {
    UsersDao,
    ProductsDao,
    CartsDao
}