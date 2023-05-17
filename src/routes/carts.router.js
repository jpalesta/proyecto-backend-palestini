const mongoose = require('mongoose')

const { Router } = require('express')

const router = Router()

const CartManagerDB = require('../dao/db/cartManagerDB.js')
const ProductManagerDB = require('../dao/db/productManagerDB.js')

//Consulta de todos los corritos
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
//Consulta de un carrito con Populate por id de producto
router.get('/:cid', async (req, res) => {
    try {
        const cid = req.params.cid
        const cart = await CartManagerDB.getCartByIdPopulate({ _id: cid })
        res.status(200).send({
            status: 'success',
            payload: cart
        })
    } catch (error) {
        console.log(error)
    }
})
//Crea un carrito con productos pasados por body
router.post('/', async (req, res) => {
    try {
        const newCart = req.body
        cart = await CartManagerDB.addCart(newCart)
        res.status(200).send({
            status: 'success',
            payload: cart
        })
    } catch (error) {
        console.log(error)
    }
})
//Agrega o incrementa un producto en un carrito, ambos pasan por params
router.post('/:cid/products/:pid', async (req, res) => {
    try {
        const cid = req.params.cid
        const pid = req.params.pid
        const cartById = await CartManagerDB.getCartById({ _id: cid })
        if (!cartById) {
            return res.send({
                status: 'error',
                error: 'Cart not found'
            })
        } else {
            const productById = await ProductManagerDB.getProductById({ _id: pid })
            if (!productById) {
                return res.status(400).send({
                    status: 'error',
                    message: 'Product not found'
                })
            } else {
                let productToAdd = cartById.products.find(p => p.product.toString() === pid)
                if (productToAdd) {
                    productToAdd.quantity++
                    await cartById.save()
                    res.status(200).send({
                        status: 'success',
                        message: 'product increased +1 ok',
                        payload: cartById
                    })
                } else {
                    productToAdd = { product: pid, quantity: 1 }
                    cartById.products.push(productToAdd)
                    await cartById.save()
                    res.status(200).send({
                        status: 'success',
                        message: 'product added ok',
                        payload: cartById
                    })
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
//Vacía un carrito por id
router.delete('/:cid', async (req, res) => {
    try {
        const cid = req.params.cid
        const cart = await CartManagerDB.deleteCartById(cid)
        res.status(200).send({
            status: 'success',
            message: `The cart ${cart._id} was emptied successfully `
        })
    } catch (error) {
        console.log(error)
    }
})
//Borra un producto de un carrito por id de carrito e id de producto
router.delete('/:cid/products/:pid', async (req, res) => {
    try {
        const cid = req.params.cid
        const pid = req.params.pid
        const cartById = await CartManagerDB.getCartById({ _id: cid })
        if (!cartById) {
            return res.send({
                status: 'error',
                error: 'cart not found'
            })
        }
        {
            const product = cartById.products.find(product => product.product._id.toString() === pid)
            console.log('pid', pid)
            console.log('cartById.products', cartById.products)
            if (!product) {
                return res.send({
                    status: 'error',
                    error: 'The product not found in cart'
                })
            }
        }
        {
            await CartManagerDB.deleteProductInCart({ _id: cid }, { _id: pid })
            res.status(200).send({
                status: 'success',
                message: `The cart ${cartById._id} was modified OK `
            })
        }
    } catch (error) {
        console.log(error)
    }
})
//Actualiza un carrito por id con un producto por body
    router.put('/:cid', async (req, res) => {
        try {
            const cid = req.params.cid
            const update = req.body
            const cartUpdated = await CartManagerDB.updateCart(cid, update)
            res.status(200).send({
                status: 'success',
                payload: cartUpdated
            })
        } catch (error) {
            console.log(error)
        }
    })
//Actualiza la cantidad de un producto en un carrito 
    router.put('/:cid/products/:pid', async (req, res) => {
        try {
            const cid = req.params.cid
            const pid = req.params.pid
            const quantity = req.body.quantity
            const cartUpdated = await CartManagerDB.updateQuantityProductInCart(cid, pid,quantity)
            res.status(200).send({
                status: 'success',
                payload: cartUpdated
            })
        } catch (error) {
            console.log(error)
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