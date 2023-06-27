const {ProductsDao} = require('../dao/factory')
const ProductRepository = require ('../repositories/products.repository')
const productsService = new ProductRepository( new ProductsDao())

const UsersDao    = require('../dao/factory')
//falta el userRepo
const usersService = UsersDao

const {CartsDao} = require('../dao/factory')
const CartRepository = require ('../repositories/carts.repository')
const cartsService = new CartRepository( new CartsDao())



module.exports = {
    usersService,
    productsService,
    cartsService
}
