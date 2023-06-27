const ProductsDao = require('../dao/factory')
const ProductRepository = require ('../repositories/products.repository')

const productsService = new ProductRepository(new ProductsDao())

const UsersDao    = require('../dao/factory')
//falta el productRepo
const usersService = UsersDao

module.exports = {
    usersService,
    productsService
}
