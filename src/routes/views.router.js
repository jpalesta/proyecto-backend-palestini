const { Router } = require('express')
const router = Router()

const ProductManagerDB = require('../dao/db/productManagerDB')

const productsModel = require('../dao/db/models/product.model.js')

router.get('/products', async (req, res) => {
    try {
        const page = parseInt(req.query.page) || 1
        const limit = parseInt(req.query.limit) || 10
        const sort = req.query.sort;
        const category = req.query.category;
        const availability = req.query.availability;
        let sortOptions = ''
        if (sort === 'asc') {
            sortOptions = { price: 1 }
        } else if (sort === 'desc') {
            sortOptions = { price: -1 }
        }
        const query = {}
        if (category) {
            const existingCategory = await productsModel.distinct('category', { category });
            if (existingCategory.length === 0) {
                throw new Error('La categoría especificada no existe');
            }
            query.category = category;
        } if (availability === 'true') {
            query.stock = { $gt: 0 }
        } else {
            ''
        }
        const products = await ProductManagerDB.getProducts(page, limit, sortOptions, query)
        console.log('products',products)
        const{docs, hasPrevPage, hasNextPage, prevPage, nextPage} = products
        console.log('docs', products.docs)
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