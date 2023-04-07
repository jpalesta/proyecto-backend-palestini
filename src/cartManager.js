const { promises } = require('fs')
const fs = promises

class CartManager {
    constructor() {
        this.carts = []
        this.path = '../assets/carts.json'
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

    addCarts = async () => {

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
    
    getCarts = async () => {
        await this.read()
        return this.carts
    }

    getCartsById = async (id) => {

        await this.read()

        let cartId = this.carts.find(cart => cart.id === id)
        if (!cartId) {
            throw 'Cart not found'
        } else {
            return cartId
        }
    }

    // updateCart = async (id, update) => {

    //     await this.read()

    //     const cartIndex = this.carts.findIndex((cart) => cart.id === id)
    //     if (cartIndex !== -1) {
    //         this.carts[cartIndex] = { ...this.carts[cartIndex], ...update }
    //         await this.write()  
    //     } else {
    //         throw 'Cart to update not found'
    //     }
    // }
    updateCart = async (id, idUpdate ) => {

        await this.read()

        const cartToUpdate = this.carts.find((cart) => cart.id === id)
console.log(cartToUpdate)
        const productIndex = cartToUpdate.products.find((prod) => prod.id === idUpdate)
            console.log(productIndex)
        if(!productIndex){
            this.carts[id] = [...cartToUpdate.products, {id: idUpdate, quantity: 1}]
            console.log(cart)
            await this.write()  
        }
        //  else{
        //     console.log('+1')
        // }

        await this.write

        // if (cartIndex !== -1) {
        //     this.carts[cartIndex] = { ...this.carts[cartIndex], ...update }
        //     await this.write()  
        // } else {
        //     throw 'Cart to update not found'
        // }
    }

    deleteCart = async (id) => {

        await this.read()

        const cartIndex = this.carts.findIndex((cart) => cart.id === id)
        if (cartIndex !== -1) {
            this.carts.splice(cartIndex, 1)
            this.write()
        } else {
            throw 'Cart to delete not found'
        }
    }
}

const cart = new CartManager();

// cart.getCarts()

// cart.addCarts()

// cart.getCartsById(3)

cart.updateCart(5,1)

// cart.deleteCart(1)








// product.getProductsById(4)

// product.addProducts({
//     title: "Décimo Producto",
//     description: 'Descripción Décimo Producto',
//     price: 5000,
//     thumbnail: 'Link Décimo Producto',
//     code: 'A10',
//     stock: 1000
// })

module.exports = CartManager;