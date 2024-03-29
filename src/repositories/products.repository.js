class ProductsRepository {
    constructor(dao) {
        this.dao = dao
    }

    getProducts() {
        return this.dao.getProducts()
    }

    getProductsPaginate(page, limit, sortOptions, query) {
        return this.dao.getProductsPaginate(page, limit, sortOptions, query)
    }

    getProduct(pid) {
        return this.dao.getProductById(pid)
    }

    getProductByCode(code) {
        return this.dao.getProductByCode(code)
    }

    createProduct(newProduct) {
        return this.dao.addProduct(newProduct)
    }

    updateProduct(pid, update) {
        return this.dao.updateProduct(pid, update)
    }

    deleteOne(pid) {
        return this.dao.deleteProduct(pid)
    }

    deleteByCode(code) {
        return this.dao.deleteProductByCode(code)
    }

    emitProductsUpdate() {
        return this.dao.emitProductsUpdate()
    }
}

module.exports = ProductsRepository
