const mongoose = require('mongoose')

const cartValidate = require('../Middlewares/validation/cart.validator')
const CartManagerDB = require('../dao/db/cartManagerDB.js')
const { cartsService } = require('../service/index.js')


class CartController {

    getAll = async (req, res) => {
        try {
            const carts = await cartsService.getCarts()
            res.status(200).send({
                status: 'success',
                payload: carts
            })
        } catch (error) {
            console.log(error)
        }
    }

    getOne = async (req, res) => {
        try {
            const cid = req.params.cid
            if (!mongoose.Types.ObjectId.isValid(cid)) {
                return res.status(400).send({
                    status: 'error',
                    message: 'Invalid cart ID format'
                })
            }
            const cart = await cartsService.getCart({ _id: cid })
            if (!cart) {
                res.status(404).send({
                    status: 'error',
                    message: `The cart number ${cid} does not exist`
                })
            }
            if (cart.products.length === 0) {
                res.status(200).send({
                    status: 'success',
                    message: `The cart number ${cid} is empty`
                })
            }
            res.status(200).send({
                status: 'success',
                payload: cart
            })
        } catch (error) {
            console.log(error)
        }
    }

    create = async (req, res) => {
        try {
            const newCart = req.body
            const isValid = cartValidate(newCart);
            if (!isValid) {
                return res.status(400).send({
                    status: 'error',
                    message: 'Formato de datos inválido',
                    error: cartValidate.errors[0].message
                });
            }
            cart = await CartManagerDB.addCart(newCart)
            if (Object.keys(cart).length === 0) {
                res.status(400).send({
                    status: 'error',
                    message: 'The product ID is wrong, please check your information'
                })
            }
            res.status(200).send({
                status: 'success',
                payload: cart
            })
        } catch (error) {
            console.log(error)
        }
    }

    update = async (req, res) => {
        try {
            const newCart = req.body
            const isValid = cartValidate(newCart);
            if (!isValid) {
                return res.status(400).send({
                    status: 'error',
                    message: 'Formato de datos inválido',
                    error: cartValidate.errors[0].message
                });
            }
            cart = await CartManagerDB.addCart(newCart)
            if (Object.keys(cart).length === 0) {
                res.status(400).send({
                    status: 'error',
                    message: 'The product ID is wrong, please check your information'
                })
            }
            res.status(200).send({
                status: 'success',
                payload: cart
            })
        } catch (error) {
            console.log(error)
        }
    }

    deleteAll = async (req, res) => {
        try {
            const cid = req.params.cid
            if (!mongoose.Types.ObjectId.isValid(cid)) {
                return res.status(400).send({
                    status: 'error',
                    message: 'Invalid cart ID format'
                })
            }
            const cart = await CartManagerDB.deleteCartById(cid)
            console.log(cart)
            if (cart === undefined) {
                return res.status(404).send({
                    status: 'error',
                    message: `The cart number ${cid} does not exist`
                })
            } else {
                res.status(200).send({
                    status: 'success',
                    message: `The cart ${cart._id} was emptied successfully `
                })
            }
        } catch (error) {
            console.log(error)
        }
    }

    deleteProduct = async (req, res) => {
        try {
            const cid = req.params.cid
            if (!mongoose.Types.ObjectId.isValid(cid)) {
                return res.status(400).send({
                    status: 'error',
                    message: 'Invalid cart ID format'
                })
            }
            const pid = req.params.pid
            if (!mongoose.Types.ObjectId.isValid(pid)) {
                return res.status(400).send({
                    status: 'error',
                    message: 'Invalid product ID format'
                })
            }
            const cartById = await CartManagerDB.getCartById({ _id: cid })
            if (!cartById) {
                return res.status(404).send({
                    status: 'error',
                    message: `The cart number ${cid} does not exist`
                })
            }
            {
                const product = cartById.products.find(product => product.product._id.toString() === pid)
                console.log('pid', pid)
                console.log('cartById.products', cartById.products)
                if (!product) {
                    return res.status(400).send({
                        status: 'error',
                        message: `Product number ${pid} not found in the cart`
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
    }

    updateProduct = async (req, res) => {
        try {
            const cid = req.params.cid
            if (!mongoose.Types.ObjectId.isValid(cid)) {
                return res.status(400).send({
                    status: 'error',
                    message: 'Invalid cart ID format'
                })
            }
            const update = req.body
            const cartUpdated = await CartManagerDB.updateCart(cid, update)
            if (cartUpdated.matchedCount === 0) {
                res.status(400).send({
                    status: 'error',
                    message: `Product ${cid} not found in Data Base`
                })
            }
            res.status(200).send({
                status: 'success',
                payload: cartUpdated
            })
        } catch (error) {
            console.log(error)
        }
    }

    updateProductQuantity = async (req, res) => {
        try {
            const cid = req.params.cid
            if (!mongoose.Types.ObjectId.isValid(cid)) {
                return res.status(400).send({
                    status: 'error',
                    message: 'Invalid cart ID format'
                })
            }
            const pid = req.params.pid
            if (!mongoose.Types.ObjectId.isValid(pid)) {
                return res.status(400).send({
                    status: 'error',
                    message: 'Invalid product ID format'
                })
            }
            const quantity = req.body.quantity
            const cartUpdated = await CartManagerDB.updateQuantityProductInCart(cid, pid, quantity)
            res.status(200).send({
                status: 'success',
                payload: cartUpdated
            })
        } catch (error) {
            console.log(error)
    
            res.status(400).send({
                status: 'error',
                message: error.message
            })
        }
    }
}

module.exports = new CartController