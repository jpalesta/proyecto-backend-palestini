class ProductsRepository {
    constructor(dao){
        this.dao = dao
    }

    getProducts(){
        return this.dao.getProducts()
    }
    getProduct(pid){
        return this.dao.getProductById(pid)
    }
    createProduct(newProduct){
        return this.dao.addProduct(newProduct)
    }
    updateProduct(pid, update){
        return this.dao.updateProduct(pid, update)

    }
    deleteOne(pid){
        return this.dao.deleteOne(pid)

    }

    emitProductsUpdate(){
        return this.dao.emitProductsUpdate()
    }

}

module.exports = ProductsRepository
