const { Router } = require('express')
const ProductManager = require('../productManager')

const router = Router()
const product = new ProductManager()

//chequeado OK
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
        return res.send({
            status: 'error',
            error: 'something was wrong'
        })
    }
})
//chequeado OK
router.get('/:pid', async (req, res) => {
    try {
        const { pid } = req.params
        const productById = await product.getProductsById(parseInt(pid))
        if (!productById) {
            return res.send({
                status: 'error',
                error: 'product not found'
            })
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
//chequeado OK
router.post('/', async (req, res) => {
    try {
        let newProduct = req.body
        await product.addProducts(newProduct)
        let lastProductIndex = product.products.length-1
        let lastProductAdded = product.products[lastProductIndex]
            res.send({
            status: 'success',
            message: 'product added OK',
            payload: lastProductAdded
        })
    } catch (error) {
        return res.status(400).send({
            status: 'error',
            message: error
        })
        console.log(productAdded)
    }
})
//chequeado OK
router.put('/:pid', async (req, res) => {
    try {
        const { pid } = req.params
        const update = req.body
        await product.updateProduct(parseInt(pid), update)
        res.send({
            status: 'success',
            message: 'product modified OK'
        })
    } catch (error) {
        return res.status(400).send({
            status: 'error',
            message: error
        })
    }
})

router.delete('/:pid', async (req, res) => {
    try {
        const { pid } = req.params
        await product.deleteProduct(parseInt(pid))
        res.send({
            status: 'success',
            message: 'product deleted OK'
        })
    } catch (error) {

        return res.send({
            status: 'error',
            error: 'product to delete not found'
        })
    }
})


module.exports = router