const productsModel = require('./models/product.model')

class ProductsDaoMongo {

    constructor() {
        this.model = productsModel
    }

    getProducts = async (page, limit, sortOptions, query) => {
        try {
            return await this.model.paginate(
                query
                , {
                    limit: limit,
                    page: page,
                    lean: true,
                    sort: sortOptions
                })
        } catch (error) {
            return new Error(error)
        }
    }

    getProductById = async (pid) => {
        try {
            return await productsModel.findOne(pid)
        } catch (error) {
            return new Error(error)
        }
    }

    addProduct = async (newProduct) => {
        try {
            return await productsModel.create(newProduct)
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
}

module.exports = ProductsDaoMongo