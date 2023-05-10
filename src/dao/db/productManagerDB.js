const productsModel = require("./models/product.model")


class ProductManagerDB {

    async getProducts() {
        try {
            const products =  await productsModel.find({})
            return products.map(p => p.toObject())
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
            const product = await productsModel.updateOne({ _id: pid }, { $set: update })
            if (!product) {
                throw new Error(`Product with ID ${pid} not found`)
            }
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

module.exports = new ProductManagerDB