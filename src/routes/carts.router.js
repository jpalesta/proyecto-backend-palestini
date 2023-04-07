const { Router } = require('express')
const CartManager = require('../cartManager')
const ProductManager = require('../productManager')

const router = Router()
const cart = new CartManager()
const product = new ProductManager()

router.post('/', async (req, res) => {
    try {
        await cart.addCarts()
        res.send({
            status: 'success',
            message: 'carrito agregado correctamente',
        })
    } catch (error) {
        res.status(400).send({
            status: 'error',
            message: error
        })
        return console.log(error)
    }
})

router.get('/:cid', async (req, res) => {
    try {
        const { cid } = req.params
        const cartById = await cart.getCartsById(parseInt(cid))
        if (!cartById) {
            return res.send({ status: 'error', error: 'cart not found' })
        }
        res.send({
            status: 'success',
            payload: cartById
        })
    } catch (error) {
        console.log(error)
        return res.send({ status: 'error', error: 'cart not found' })
    }
})

router.post('/:cid/products/:pid', async (req, res) => {
    try {
        const { cid } = req.params
        const cartById = await cart.getCartsById(parseInt(cid))
        if (!cartById) {
            console.log(cartById)
            return res.send({ status: 'error', error: 'cart not found' })
        }
        const { pid } = req.params
        const productById = await product.getProductsById(parseInt(pid))
        if (!productById) {
            return res.send({ status: 'error', error: 'product not found' })
        }

        console.log(cartById.products)
        console.log(productById.id)
        console.log(pid)

        const productToUpdate = cartById.products.find(prod => prod.id === parseInt(pid))
        console.log(productToUpdate)
        if (!productToUpdate) {
            cartById.products.push({id:pid, quantity: 1})
        } else {
            console.log('tengo que capturar cant')
        }
        //     await cart.updateCart(parseInt(cid), {id: parseInt(pid), quantity: 1})
        // } if (productIndex !== -1) {
        //     cartById.products.push({ id : pid, quantity: 2 })
        // no estoy grabando en el archivo, tengo que usar el método update
        // }
    } catch (error) {
        return console.log(error
        )
    }

})


module.exports = router