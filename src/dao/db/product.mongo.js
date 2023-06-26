const productsModel = require("./models/product.model")

class ProductManagerDB {

    async getProducts(page, limit, sortOptions, query) {
        try {
            return await productsModel.paginate(
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

    async getProductById(pid) {
        try {
            return await productsModel.findOne(pid)
        } catch (error) {
            return new Error(error)
        }
    }

    async addProduct(newProduct) {
        try {
            return await productsModel.create(newProduct)
        } catch (error) {
            return new Error(error)
        }
    }

    async updateProduct(pid, update) {
        try {
            return await productsModel.updateOne({ _id: pid }, { $set: update })
        } catch (error) {
            return new Error(error)
        }
    }

    async deleteProduct(pid) {
        try {
            return await productsModel.deleteOne(pid)
        } catch (error) {
            return new Error(error)
        }
    }
}

module.exports = new ProductsDaoMongo