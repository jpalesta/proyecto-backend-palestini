//Socket
const io = require('socket.io-client')

const productsModel = require('./models/product.model')

class ProductsDaoMongo {
    constructor() {
        this.model = productsModel
    }

    getProducts = async () => {
        try {
            return await this.model.find()
        } catch (error) {
            return new Error(error)
        }
    }

    getProductsPaginate = async (page, limit, sortOptions, query) => {
        try {
            return await this.model.paginate(query, {
                limit: limit,
                page: page,
                lean: true,
                sort: sortOptions,
            })
        } catch (error) {
            return new Error(error)
        }
    }

    getProductById = async (pid) => {
        try {
            return await this.model.findOne(pid)
        } catch (error) {
            return new Error(error)
        }
    }

    addProduct = async (newProduct) => {
        try {
            return await this.model.create(newProduct)
        } catch (error) {
            return new Error(error)
        }
    }

    updateProduct = async (pid, update) => {
        try {
            return await productsModel.updateOne({ _id: pid }, { $set: update })
        } catch (error) {
            return new Error(error)
        }
    }

    deleteProduct = async (pid) => {
        try {
            return await this.model.deleteOne(pid)
        } catch (error) {
            return new Error(error)
        }
    }

    emitProductsUpdate = async function () {
        const socket = io('ws://localhost:8080')
        const products = await this.model.find()
        socket.emit('productsUpdated', products.docs)
    }
}

module.exports = ProductsDaoMongo
