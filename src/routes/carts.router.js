const mongoose = require('mongoose')

const { Router } = require('express')

const router = Router()

const {getAll, getOne, create, update, deleteAll, updateProduct, deleteProduct, updateProductQuantity} = require ('../controllers/carts.controller')

//Consulta de todos los corritos check ok
router.get('/', getAll)

//Consulta de un carrito con Populate por id de producto
router.get('/:cid', getOne)

//Crea un carrito con productos pasados por body check ok con validación
router.post('/', create)
//Agrega o incrementa un producto en un carrito, ambos pasan por params check ok
router.post('/:cid/products/:pid', update)

//Vacía un carrito por id check ok
router.delete('/:cid', deleteAll)

//Borra un producto de un carrito por id de carrito e id de producto
router.delete('/:cid/products/:pid', deleteProduct)

//Actualiza un carrito por id con un producto por body check ok falta validación del body
router.put('/:cid', updateProduct)

//actualiza la cantidad de un producto de un carrito por id con cantidad por body check ok falta validar body
router.put('/:cid/products/:pid', updateProductQuantity)

module.exports = router

//LÓGICA FILES
// const CartManager = require('../dao/fileSystem/cartManager')
// const ProductManager = require('../dao/fileSystem/productManager')

// const cart = new CartManager()
// const product = new ProductManager()

// //chequeado OK
// router.post('/', async (req, res) => {
//     try {
//         await cart.addCarts()
//         let newCartArray = await cart.getCarts()
//         res.send({
//             status: 'success',
//             message: 'carrito agregado correctamente',
//             payload: newCartArray
//         })
//     } catch (error) {
//         res.status(400).send({
//             status: 'error',
//             message: error
//         })
//     }
// })
// //chequeado OK
// router.get('/:cid', async (req, res) => {
//     try {
//         const { cid } = req.params
//         const cartById = await cart.getCartsById(parseInt(cid))
//         if (!cartById) {
//             return res.send({
//                 status: 'error',
//                 error: 'cart not found'
//             })
//         }
//         res.send({
//             status: 'success',
//             payload: cartById
//         })
//     } catch (error) {
//         return res.send({
//             status: 'error',
//             error: 'cart not found'
//         })
//     }
// })
// //chequeado OK
// router.post('/:cid/products/:pid', async (req, res) => {
//     try {
//         const { cid, pid } = req.params
//         const cartById = await cart.getCartsById(parseInt(cid))
//         if (!cartById) {
//             return res.send({
//                 status: 'error',
//                 error: 'cart not found'
//             })
//         } else {
//             const productById = await product.getProductsById(parseInt(pid))
//             if (!productById) {
//                 return res.status(400).send({
//                     status: 'error',
//                     message: 'Product not found'
//                 })
//             } else {
//                 let productToAdd = cartById.products.find(prod => prod.id === parseInt(pid))
//                 if (productToAdd) {
//                     productToAdd.quantity++
//                     await cart.updateCart(cid, cartById)
//                     res.status(200).send({
//                         status: 'success',
//                         message: 'product increased +1 ok',
//                         payload: cartById
//                     })
//                 } else {
//                     productToAdd = { id: parseInt(pid), quantity: 1 }
//                     cartById.products.push(productToAdd)
//                     await cart.updateCart(cid, cartById)
//                     res.status(200).send({
//                         status: 'success',
//                         message: 'product added ok',
//                         payload: cartById
//                     })
//                 }
//             }
//         }
//     } catch (error) {
//         return res.status(400).send({
//             status: 'error',
//             error: 'cart or product not found'
//         })
//     }
// })