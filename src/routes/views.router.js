const { Router } = require('express')
const router = Router()

const ProductManagerDB = require('../dao/db/productManagerDB')


router.get('/', async (req, res) => {
    try {
        const {page} = req.query
        const {limit} = req.query

        const products = await ProductManagerDB.getProducts(page,limit)
        const{docs, hasPrevPage, hasNextPage, prevPage, nextPage} = products
        let testUser = {
            title: 'Lista de Productos',
            products: docs,
            hasPrevPage,
            hasNextPage,
            prevPage,
            nextPage
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

router.get('/formcookies', (req, res) => {
    let testUser = {
        title: 'formcookies'
        }
    res.render('formcookies', testUser)
})

module.exports = router