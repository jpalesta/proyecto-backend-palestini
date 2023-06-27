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
    deleteProduct(pid){
        return this.dao.deleteProduct(pid)

    }
}

module.exports = ProductsRepository
