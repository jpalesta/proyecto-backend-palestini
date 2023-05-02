const productsModel = require("./models/product.model")

class ProductManagerDB {

    async getProducts() {
        try {
            return await productsModel.find({})
        } catch (error){
            return new Error(error)
        }
    }

    async getProductById() {}

    async addProduct(newProduct) {
        try{
        return await productsModel.create(newProduct)
    } catch (error){
        return new Error(error)
    }
}
    async updateProduct() {}
    async deleteProduct() {}
}

module.exports = new ProductManagerDB