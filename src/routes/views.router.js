const { Router } = require('express')
const router = Router()

const ProductManager = require('../dao/fileSystem/productManager')
const product = new ProductManager()

router.get('/', async (req, res) => {
    try {
        const products = await product.getProducts()
        let testUser = {
            title: 'Lista de Productos',
            products: products
        }
        res.render('index', testUser)
    } catch (error) {
        console.log(error)
        return res.send({ status: 'error', message: 'something was wrong' })
    }
})

router.get('/realtimeproducts', (req, res) => {
    let testUser = {
        title: 'Listado de Productos dinámico'
    }
    res.render('realTimeProducts', testUser)
})

module.exports = router