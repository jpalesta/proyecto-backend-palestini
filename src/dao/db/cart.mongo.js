const cartsModel = require('./models/cart.model')
const { logger } = require('../../utils/logger')

class CartManagerDB {
    constructor() {
        this.model = cartsModel
    }

    getCarts = async () => {
        try {
            return await this.model.find({})
        } catch (error) {
            return new Error(error)
        }
    }

    getCartById = async (cid) => {
        try {
            return await this.model.findById(cid)
        } catch (error) {
            return new Error(error)
        }
    }

    getCartByIdPopulate = async (cid) => {
        try {
            return await this.model
                .findOne(cid)
                .populate('products.product')
                .lean()
        } catch (error) {
            logger.error(error)
        }
    }

    createCart = async (newCart) => {
        try {
            return await this.model.create(newCart)
        } catch (error) {
            return new Error(error)
        }
    }

    updateCart = async (cid, update) => {
        try {
            return await this.model.updateOne({ _id: cid }, { $set: update })
        } catch (error) {
            return new Error(error)
        }
    }

    updateProductInCart = async (cid, pid) => {
        try {
            const cart = await this.model.findById({ _id: cid })
            if (!cart) {
                throw new Error(`Cart with ID ${cid} not found`)
            }
            const productIndex = cart.products.findIndex(
                (p) => p.product.toString() === pid
            )
            if (productIndex === -1) {
                const newProduct = {
                    product: pid,
                    quantity: 1,
                }
                cart.products.push(newProduct)
            } else {
                cart.products[productIndex].quantity += 1 
            }
            await cart.save()
            return cart
        } catch (error) {
            logger.error(error)
        }
    }

    updateQuantityProductInCart = async (cid, pid, quantity) => {
        try {
            const cart = await this.model.findById({ _id: cid })
            if (!cart) {
                throw new Error(`Cart with ID ${cid} not found`)
            }
            const productIndex = cart.products.findIndex(
                (p) => p.product.toString() === pid
            )
            if (productIndex === -1) {
                const newProduct = {
                    product: pid,
                    quantity: quantity,
                }
                cart.products.push(newProduct)
            } else {
                cart.products[productIndex].quantity = quantity
            }
            await cart.save()
            return cart
        } catch (error) {
            logger.error(error)
        }
    }

    deleteCartById = async (cid) => {
        try {
            const cart = await this.model.findOne({ _id: cid })
            if (!cart) {
                throw new Error(`Cart with ID ${cid} not found`)
            }
            return await this.model.findByIdAndUpdate(
                { _id: cid },
                { $set: { products: [] } }
            )
        } catch (error) {
            logger.error(error)
        }
    }

    deleteProductInCart = async (cid, pid) => {
        try {
            const cart = await this.model.findOne({ _id: cid })
            if (!cart) {
                throw new Error(`Cart with ID ${cid} not found`)
            }
            return await this.model.updateOne(
                { _id: cid },
                { $pull: { products: { product: pid } } }
            )
        } catch (error) {
            return new Error(error)
        }
    }
}

module.exports = CartManagerDB
