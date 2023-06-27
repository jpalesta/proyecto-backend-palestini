const config = require('../config/objectConfig')


//no esta funcionando (VER log en app)

let UsersDao
let ProductsDao


switch (config.persistence) {
    case 'MONGO':
        config.connectDB()
        const UsersDaoMongo = require('../dao/db/user.mongo')
        const ProductsDaoMongo = require('../dao/db/product.mongo')

        UsersDao = UsersDaoMongo
        ProductsDao =  ProductsDaoMongo

        console.log('ProductsDao en factory', ProductsDao)
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