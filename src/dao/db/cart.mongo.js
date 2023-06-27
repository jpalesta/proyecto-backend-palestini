const cartsModel = require("./models/cart.model")


class CartManagerDB {

    constructor() {
        this.model = cartsModel
    }

    getCarts = async () => {
        try {
            return await cartsModel.find({})
        } catch (error) {
            return new Error(error)
        }
    }

    getCartById = async (cid) => {
        try {
            return await cartsModel.findById(cid)
        } catch (error) {
            return new Error(error)
        }
    }

    getCartByIdPopulate = async (cid) => {
        try {
            return await cartsModel.findOne(cid)
                .populate('products.product').lean()
        } catch (error) {
            console.log(error)
        }
    }

    createCart = async (newCart) => {
        try {
            return await cartsModel.create(newCart)
        } catch (error) {
            return new Error(error)
        }
    }

    deleteCartById = async (cid) => {
        try {
            const cart = await cartsModel.findOne({ _id: cid })
            if (!cart) {
                throw new Error(`Cart with ID ${cid} not found`)
            }
            return await cartsModel.findByIdAndUpdate({ _id: cid }, { $set: { products: [] } })
        } catch (error) {
            console.log(error)
        }
    }

    deleteProductInCart = async (cid, pid) => {
        try {
            const cart = await cartsModel.findOne({ _id: cid })
            if (!cart) {
                throw new Error(`Cart with ID ${cid} not found`)
            }
            return await cartsModel.updateOne({ _id: cid }, { $pull: { products: { product: pid } } })
        } catch (error) {
            return new Error(error)
        }
    }

    updateCart = async (cid, update) => {
        try {
            return await cartsModel.updateOne({ _id: cid }, { $set: update })
        } catch (error) {
            return new Error(error)
        }
    }

    updateQuantityProductInCart = async (cid, pid, quantity) => {
        try {
            const cart = await cartsModel.findById({ _id: cid })
            if (!cart) {
                throw new Error(`Cart with ID ${cid} not found`)
            }
            const productIndex = cart.products.findIndex((p) => p.product.toString() === pid);
            if (productIndex === -1) {
                throw new Error(` product ${pid} not found in cart ${cid}`)
            }
            cart.products[productIndex].quantity = quantity;
            await cart.save();
            return cart
        } catch (error) {
            throw new Error(error)
        }
    }
    
}

module.exports =  CartManagerDB