const mongoose = require('mongoose')
const ObjectId = require('mongodb').ObjectId;

const { Router } = require('express')

const router = Router()

const CartManagerDB = require('../dao/db/cartManagerDB.js')
const ProductManagerDB = require('../dao/db/productManagerDB.js')

router.get('/', async (req, res) => {
    try {
        const carts = await CartManagerDB.getCarts()
        res.status(200).send({
            status: 'success',
            payload: carts
        })
    } catch (error) {
        console.log(error)
    }
})

router.get('/:pid', async (req, res) => {
    try {
        const pid = req.params.pid
        const cart = await CartManagerDB.getCartById({ _id: pid })
        res.status(200).send({
            status: 'success',
            payload: cart
        })
    } catch (error) {
        console.log(error)
    }
})

router.post('/', async (req, res) => {
    try {
        const newCart = req.body
        console.log('clg NewCart apenas viene', newCart)
        cart = await CartManagerDB.addCart(newCart)
        console.log('clg newCart', newCart)
        res.status(200).send({
            status: 'success',
            payload: cart
        })
    } catch (error) {
        console.log(error)
    }
})

router.put('/:pid', async (req, res) => {
    try {
        const pid = req.params.pid
        const update = req.body
        const cartUpdated = await CartManagerDB.updateCart(pid, update)
        res.status(200).send({
            status: 'success',
            payload: cartUpdated
        })
    } catch (error) {
        console.log(error)
    }
})

router.post('/:cid/products/:pid', async (req, res) => {
    try {
        const { cid, pid } = req.params
        console.log('cid', cid)
        console.log('pid', pid)
        const cartById = await CartManagerDB.getCartById({ _id: cid })
        console.log('cartById', cartById)
        console.log('cartById.products', cartById.products)
        if (!cartById) {
            return res.send({
                status: 'error',
                error: 'cart not found'
            })
        } else {
            const productById = await ProductManagerDB.getProductById({ _id: pid })
            console.log('productById', productById)
            if (!productById) {
                return res.status(400).send({
                    status: 'error',
                    message: 'Product not found'
                })
            } else {
                let productToAdd = cartById.products.find((product) => product.toString() === pid)
                console.log('productToAdd', productToAdd)
                if (productToAdd) {
                    productToAdd.quantity++
                    await cartById.save()
                    res.status(200).send({
                        status: 'success',
                        message: 'product increased +1 ok',
                        payload: cartById
                    })
                } else {
                    console.log('agrega un nuevo producto')
                    // productToAdd = { product: pid, quantity: 1 }
                    // cartById.products.push(productToAdd)
                    // await cartById.save()
                    // res.status(200).send({
                    //     status: 'success',
                    //     message: 'product added ok',
                    //     payload: cartById
                    // })
                }
            }
        }
    } catch (error) {
        return res.status(400).send({
            status: 'error',
            error: 'cart or product not found'
        })
    }
})
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