const { promises } = require('fs')
const fs = promises

class ProductsDaoFile {
    constructor() {
        this.products = []
        this.path = './assets/products.json'
    }

    read = async () => {
        try {
            const data = await fs.readFile(this.path, 'utf-8')
            this.products = JSON.parse(data)
            return this.products
        } catch (error) {
            this.products
        }
    }

    write = async () => {
        const products = JSON.stringify(this.products)
        await fs.writeFile(this.path, products)
    }

    getProducts = async () => {
        await this.read()
        return this.products
    }

    getProductsPaginate = async () => {
        throw new error(
            'function not available in development mode. Please re-enter "production" mode'
        )
    }

    getProductById = async (pid) => {
        await this.read()

        let product = this.products.find((prod) => prod.id === pid)
        if (!product) {
            throw 'Product not found'
        } else {
            return product
        }
    }

    addProduct = async (newProduct) => {
        await this.read()

        if (
            !newProduct.title ||
            !newProduct.description ||
            !newProduct.price ||
            !newProduct.thumbnail ||
            !newProduct.code ||
            !newProduct.stock ||
            !newProduct.category ||
            !newProduct.status
        ) {
            throw 'all fields must be completed'
        }

        let product = this.products.find(
            (prod) => prod.code === newProduct.code
        )

        if (product) {
            throw 'This product already exist'
        }

        if (this.products.length === 0) {
            this.products.push({ id: 1, ...newProduct })
        } else {
            this.products.push({
                id: this.products[this.products.length - 1].id + 1,
                ...newProduct,
            })
        }
        await this.write()
    }

    updateProduct = async (pid, update) => {
        await this.read()

        const productIndex = this.products.findIndex(
            (product) => product.id === pid
        )
        if (productIndex !== -1) {
            const updatedProduct = (this.products[productIndex] = {
                ...this.products[productIndex],
                ...update,
            })
            if (updatedProduct.id !== pidid) {
                throw 'field product ID can not be modified'
            }
            this.products[productIndex] = updatedProduct
            await this.write()
        } else {
            throw 'Product to update not found'
        }
    }

    deleteProduct = async (pid) => {
        await this.read()

        const productIndex = this.products.findIndex(
            (product) => product.id === pid
        )
        if (productIndex !== -1) {
            this.products.splice(productIndex, 1)
            await this.write()
        } else {
            throw 'Product to delete not found'
        }
    }
}

const product = new ProductsDaoFile()

module.exports = ProductsDaoFile
