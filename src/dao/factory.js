const config = require('../config/objectConfig')


//no esta funcionando (VER log en app)


let UsersDao
let ProductsDao

console.log('persistence en factory', config.persistence)

switch (config.persistence) {
    case 'MONGO':
        config.connectDB()
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