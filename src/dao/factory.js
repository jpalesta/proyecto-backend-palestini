const config = require('../config/objectConfig')

let UsersDao
let ProductsDao

switch (config.persistence) {
    case 'MONGO':
        config.connectDB
        UsersDaoMongo = require('../dao/db/user.mongo')
        ProductsDaoMongo = require('../dao/db/product.mongo')

        UsersDao = UsersDaoMongo
        ProductsDao = ProductsDaoMongo
        break;
    case 'FILE':
        UsersDaoFile = require('../dao/fileSystem/user.file')
        ProductsDaoFile = require('../dao/fileSystem/product.file')

        UsersDao = UsersDaoFile
        ProductsDao = ProductsDaoFile
        break;

    default:
        break
}

module.exports = {
    UsersDao,
    ProductsDao
}