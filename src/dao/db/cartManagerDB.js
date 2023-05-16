const cartsModel = require("./models/cart.model")

 
class CartManagerDB {

    async getCarts() {
        try {
            return await cartsModel.find({})
        } catch (error) {
            return new Error(error)
        }
    }

    async getCartById(pid) {
        try {
            return await cartsModel.findById(pid).populate('products.product')
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

    async updateCart(pid, update) {
        try {
            const cart = await cartsModel.updateOne({_id: pid}, { $set: update })
            if (!cart) {
                throw new Error(`Cart with ID ${pid} not found`)
            }
            return await cartsModel.updateOne({ _id: pid }, { $set: update })
        } catch (error) {
            return new Error(error)
        }
    }

    async deleteCartById(cid) {
        try {
            const cart = await cartsModel.findOne({_id: cid})
            console.log('cart',cart)
            if (!cart) {
                throw new Error(`Cart with ID ${cid} not found`)
            }
            return await cartsModel.findByIdAndUpdate({_id: cid}, { $set: {products: []} })
        } catch (error) {
            return new Error(error)
        }
    }
}


module.exports = new CartManagerDB