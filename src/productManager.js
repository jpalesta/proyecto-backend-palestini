const { promises } = require('fs')
const fs = promises

class ProductManager {

    constructor() {
        this.products = []
        this.path = '../products.json'
    }

    read = async () => {
        try {
            const data = await fs.readFile(this.path, 'utf-8')
            this.products = JSON.parse(data)
            // console.log(this.products)
            return this.products
        } catch (error) {
            this.products = []
        }
    }

    write = async () => {
        const products = JSON.stringify(this.products)
        await fs.writeFile(this.path, products)
    }

    addProducts = async (newProduct) => {

        await this.read()

        if (!newProduct.title ||
            !newProduct.description ||
            !newProduct.price ||
            !newProduct.thumbnail ||
            !newProduct.code ||
            !newProduct.stock) {
            throw 'todos los campos son necesarios'
        }

        let product = this.products.find(prod => prod.code === newProduct.code)

        if (product) {
            throw 'This product already exist'
        }

        if (this.products.length === 0) {
            this.products.push({ id: 1, ...newProduct })
        } else {
            this.products.push({
                id: this.products[this.products.length - 1].id + 1, ...newProduct
            })
        }
        await this.write()
    }
    
    getProducts = async () => {
        await this.read()
        // console.log(this.products)
        return this.products
    }

    getProductsById = async (id) => {

        await this.read()

        let product = this.products.find(prod => prod.id === id)
        if (!product) {
            throw 'Product not found'
        } else {
            // console.log(product)
            return product
        }
    }

    updateProduct = async (id, update) => {

        await this.read()

        const productIndex = this.products.findIndex((product) => product.id === id)
        if (productIndex !== -1) {
            this.products[productIndex] = { ...this.products[productIndex], ...update }
            this.write()
        } else {
            throw 'Product to update not found'
        }
    }

    deleteProduct = async (id) => {

        await this.read()

        const productIndex = this.products.findIndex((product) => product.id === id)
        if (productIndex !== -1) {
            this.products.splice(productIndex, 1)
            this.write()
        } else {
            throw 'Product to delete not found'
        }
    }
}

const product = new ProductManager();

// product.getProductsById(4)

// product.addProducts({
//     title: "Décimo Producto",
//     description: 'Descripción Décimo Producto',
//     price: 5000,
//     thumbnail: 'Link Décimo Producto',
//     code: 'A10',
//     stock: 1000
// })

module.exports = ProductManager;