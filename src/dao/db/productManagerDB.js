const { ObjectId } = require('mongoose');
const productsModel = require("./models/product.model")


class ProductManagerDB {

    async getProducts() {
        try {
            return await productsModel.find({})
        } catch (error){
            return new Error(error)
        }
    }

    async getProductById(pid) {
        try{
        return await productsModel.findOne(pid)
    } catch (error){
        return new Error(error)
    }
}


    async addProduct(newProduct) {
        try{
            console.log('clg newProduct add', newProduct)
        return await productsModel.create(newProduct)
    } catch (error){
        return new Error(error)
    }
}
    async updateProduct() {}
    async deleteProduct() {}
}

module.exports = new ProductManagerDB