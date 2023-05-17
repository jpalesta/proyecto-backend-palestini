const cartsModel = require("./models/cart.model")


class CartManagerDB {

    async getCarts() {
        try {
            return await cartsModel.find({})
        } catch (error) {
            return new Error(error)
        }
    }

    async getCartById(cid) {
        try {
            return await cartsModel.findById(cid)
        } catch (error) {
            return new Error(error)
        }
    }

    async getCartByIdPopulate(cid) {
        try {
            return await cartsModel.findById(cid)
                .populate('products.product')
        } catch (error) {
            return new Error(error)
        }
    }

    async addCart(newCart) {
        try {
            return await cartsModel.create(newCart)
        } catch (error) {
            return new Error(error)
        }
    }

    async deleteCartById(cid) {
        try {
            const cart = await cartsModel.findOne({ _id: cid })
            if (!cart) {
                throw new Error(`Cart with ID ${cid} not found`)
            }
            return await cartsModel.findByIdAndUpdate({ _id: cid }, { $set: { products: [] } })
        } catch (error) {
            return new Error(error)
        }
    }

    async deleteProductInCart(cid, pid) {
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

    async updateCart(cid, update) {
        try {
            const cart = await cartsModel.findById({ _id: cid })
            if (!cart) {
                throw new Error(`Cart with ID ${cid} not found`)
            }
            return await cartsModel.updateOne({ _id: cid }, { $set: update })
        } catch (error) {
            return new Error(error)
        }
    }

    async updateQuantityProductInCart(cid, pid, quantity) {
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
            return new Error(error)
        }
    }
}

module.exports = new CartManagerDB