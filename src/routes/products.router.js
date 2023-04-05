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
                result: products
            })
        }
        return res.send({
            status: 'success',
            result: products.slice(0, limit)
        })

    } catch (error) {
        console.log(error)
    }
})

router.get('/:pid', async (req, res) => {
    try {
        const { pid } = req.params
        const productDb = await product.getProductsById(parseInt(pid))
        if (!productDb) {
            return res.send({ status: 'error', error: 'product not found' })
        }
        res.send({ productDb })
    } catch (error) {
        console.log(error)
        return res.send({ status: 'error', error: 'product not found' })
    }
})

router.post('/', async (req, res) => {
        try{
            let newProduct = req.body
        await product.addProducts(newProduct)
res.send({
    status: 'success',
    message: 'producto agregado correctamente',
    newProduct
})
        } catch (error) {
            res.status(400).send({status: 'error',
            message: error})
            return console.log(error)
        }
    //     let products = await product.read
    //     if (!newProduct.title ||
    //         !newProduct.description ||
    //         !newProduct.price ||
    //         !newProduct.thumbnail ||
    //         !newProduct.code ||
    //         !newProduct.stock) {
    //         return res.status(400).send({ status: 'error', error: 'all fields must be completed' })
    //     }
    //     let productCode = this.products.find(prod => prod.code === newProduct.code)

    //     if (productCode) {
    //         return res.send({status: "error", error: 'This product already exist'}) 
    //     }
    //     if (this.products.length === 0) {
    //         this.products.push({ id: 1, ...newProduct })
    //     } else {
    //         this.products.push({
    //             id: this.products[this.products.length - 1].id + 1, ...newProduct
    //         })
    //         await product.write
    //        return res.status(200).send({ newProduct })
    //     }
    // } catch (error) {
    //     return console.log(error)
    // }
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