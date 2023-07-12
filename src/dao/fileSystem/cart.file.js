const { promises } = require('fs')
const fs = promises

class CartManager {

    constructor() {
        this.carts = []
        this.path = './assets/carts.json'
    }

    read = async () => {
        try {
            const data = await fs.readFile(this.path, 'utf-8')
            this.carts = JSON.parse(data)
            return this.carts
        } catch (error) {
            this.carts
        }
    }

    write = async () => {
        const carts = JSON.stringify(this.carts)
        await fs.writeFile(this.path, carts)
    }

    getCarts = async () => {
        await this.read()
        return this.carts
    }

    getCartById = async (cid) => {

        await this.read()

        let cartId = this.carts.find(cart => cart.id === cid)
        if (!cartId) {
            throw 'Cart not found'
        } else {
            return cartId
        }
    }

    getCartByIdPopulate = (cid) => {
        throw new error('function not available in development mode. Please re-enter "production" mode')
    }

    createCart = async (newCart) => {

        await this.read()

        if (this.carts.length === 0) {
            this.carts.push({ id: 1, products: [] })
        } else {
            this.carts.push({
                id: this.carts[this.carts.length - 1].id + 1, products: []
            })
        }
        await this.write()
    }

    updateCart = async (pid, update) => {

        await this.read()

        const cartIndex = this.carts.findIndex((cart) => cart.id === parseInt(pid))
        if (cartIndex !== -1) {

            this.carts[cartIndex] = { ...this.carts[cartIndex], ...update }
            await this.write()
        } else {
            throw 'Cart to update not found'
        }
    }

    updateQuantityProductInCart = async (pid, update) => {
        throw new error('function not available in development mode. Please re-enter "production" mode')
    }

    deleteCartById = async (cid) => {

        await this.read()

        const cartIndex = this.carts.findIndex((cart) => cart.id === id)
        if (cartIndex !== -1) {
            this.carts.splice(cartIndex, 1)
            this.write()
        } else {
            throw 'Cart to delete not found'
        }
    }

    deleteProductInCart = async (cid, pid) => {
        throw new error('function not available in development mode. Please re-enter "production" mode')
    }
}
module.exports = CartManager;