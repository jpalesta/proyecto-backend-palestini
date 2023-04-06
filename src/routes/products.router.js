const { Router } = require('express')
const ProductManager = require('../productManager')

const router = Router()
const product = new ProductManager()


router.get('/', async (req, res) => {
    try {
        const { limit } = req.query
        const products = await product.getProducts()
        if (!limit) {
            return res.send({
                status: 'success',
                payload: products
            })
        }
        return res.send({
            status: 'success',
            payload: products.slice(0, limit)
        })

    } catch (error) {
        console.log(error)
    }
})

router.get('/:pid', async (req, res) => {
    try {
        const { pid } = req.params
        const productById = await product.getProductsById(parseInt(pid))
        if (!productById) {
            return res.send({ status: 'error', error: 'product not found' })
        }
        res.send({
            status: 'success',
            payload: productById
        })
    } catch (error) {
        console.log(error)
        return res.send({ status: 'error', error: 'product not found' })
    }
})

router.post('/', async (req, res) => {
    try {
        let newProduct = req.body
        await product.addProducts(newProduct)
        res.send({
            status: 'success',
            message: 'producto agregado correctamente',
            payload: newProduct
        })
    } catch (error) {
        res.status(400).send({
            status: 'error',
            message: error
        })
        return console.log(error)
    }
})

router.put('/:pid', async (req, res) => {
    try {
        const { pid } = req.params
        const update = req.body
        await product.updateProduct(parseInt(pid), update)
        res.send({
            status: 'success',
            message: 'producto modificado correctamente'
        })
    } catch (error) {
        res.status(400).send({
            status: 'error',
            message: error
        })
        return console.log(error)
    }
})


router.delete('/:pid', async (req, res) => {
    try {
        const { pid } = req.params
        await product.deleteProduct(parseInt(pid))
        res.send({
            status: 'success',
            message: 'Producto eliminado correctamente'
        })
    } catch (error) {
        console.log(error)
        return res.send({ status: 'error', error: 'product not found' })
    }
})


module.exports = router