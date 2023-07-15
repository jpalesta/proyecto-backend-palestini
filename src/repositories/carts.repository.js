class CartsRepository {
    
    constructor(dao){
        this.dao = dao
    }

    getCarts(){
        return this.dao.getCarts()
    }

    getCart(pid){
        return this.dao.getCartById(pid)
    }

    getCartPopulate(cid){
        return this.dao.getCartByIdPopulate(cid)
    }

    createCart(newProduct){
        return this.dao.createCart(newProduct)
    }

    updateCart(pid, update){
        return this.dao.updateCart(pid, update)
    }

    deleteOne(pid){
        return this.dao.deleteCart(pid)

    }

    deleteProduct(cid, pid) {
        return this.dao.deleteProductInCart(cid, pid)
    }

    updateQuantityProductInCart (cid, pid, quantity) {
        return this.dao.updateQuantityProductInCart(cid, pid, quantity)
    }

}

module.exports = CartsRepository
