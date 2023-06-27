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
    createCart(newProduct){
        return this.dao.addCart(newProduct)
    }
    updateCart(pid, update){
        return this.dao.updateCart(pid, update)

    }
    deleteOne(pid){
        return this.dao.deleteCart(pid)

    }

}

module.exports = CartsRepository
