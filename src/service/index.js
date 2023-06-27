const {ProductsDao} = require('../dao/factory')
const ProductRepository = require ('../repositories/products.repository')

console.log('ProductsDao en service', ProductsDao)
const productsService = new ProductRepository( new ProductsDao())

const UsersDao    = require('../dao/factory')
//falta el productRepo
const usersService = UsersDao

module.exports = {
    usersService,
    productsService
}
