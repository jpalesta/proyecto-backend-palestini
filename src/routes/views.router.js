const { Router } = require('express')
const router = Router()

const ProductManagerDB = require('../dao/db/productManagerDB')


router.get('/', async (req, res) => {
    try {
        const products = await ProductManagerDB.getProducts()
        console.log('productos fijo',products)
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
        title: 'Listado de Productos dinámico',
        }
    res.render('realTimeProducts', testUser)
})

router.get('/chat', (req, res) =>{
    res.render('chat', {})
})
module.exports = router