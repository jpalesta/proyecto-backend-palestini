const { Router } = require('express')
const router = Router()

const ProductManagerDB = require('../dao/db/productManagerDB')
const CartManagerDB = require('../dao/db/cartManagerDB')

const productsModel = require('../dao/db/models/product.model.js')

router.get('/products', async (req, res) => {
    try {
        let page = parseInt(req.query.page)
        if (!page) {
            page = 1
        }
        if (isNaN(page)) {
            res.send({
                status: 'error',
                message: 'The page value is NaN'
            })
        }
        const limit = parseInt(req.query.limit) || 10
        const sort = req.query.sort;
        const category = req.query.category
        const availability = req.query.availability
        let sortOptions = ''
        if (sort === 'asc') {
            sortOptions = { price: 1 }
        } else if (sort === 'desc') {
            sortOptions = { price: -1 }
        }
        const query = {}
        if (category) {
            const existingCategory = await productsModel.distinct('category', { category })
            if (existingCategory.length === 0) {
                throw new Error('The specified category does not exist')
            }
            query.category = category
        } if (availability === 'true') {
            query.stock = { $gt: 0 }
        } else {
            ''
        }
        //hacer 1° llamado solo con limit y comparar 
        const result = await ProductManagerDB.getProducts(page, limit, sortOptions, query)
        const { totalPages } = result
        if (page > totalPages) {
            res.send({
                status: 'error',
                message: 'The page value is too high'
            })
        }
        const products = await ProductManagerDB.getProducts(page, limit, sortOptions, query)
        const { docs, hasPrevPage, hasNextPage, prevPage, nextPage } = products
        const currentURL = req.protocol + '://' + req.get('host') + req.originalUrl
        const prevLink = hasPrevPage ? createLink(currentURL, page, prevPage) : null
        const nextLink = hasNextPage ? createLink(currentURL, page, nextPage) : null
        let testUser = {
            title: 'Lista de Productos',
            products: docs,
            hasPrevPage,
            hasNextPage,
            prevPage,
            nextPage,
            prevLink,
            nextLink
        }
        res.render('index', testUser)
    } catch (error) {
        console.log(error)
        return res.send({ status: 'error', message: 'something was wrong' })
    }
    function createLink(currentURL, page, newPage) {
        const newURL = (currentURL.includes('page')) ? currentURL.replace('page=' + page, 'page=' + newPage) : currentURL + '&page=' + newPage
        return newURL
    }
})

router.get('/cart/:cid', async (req, res) => {
    try {
        const cid = req.params.cid
        const cart = await CartManagerDB.getCartByIdPopulate({ _id: cid })
        console.log('cart.products', cart.products)
        if (cart.products.length === 0) {
            console.log('entró al if')
            let testUser = {
                title: `Cart Number ${cart._id} is empty`
            }
            res.render('cart', testUser)
        }
        console.log('no entró al if')
        let testUser = {
            title: `Cart Number ${cart._id}`,
            products: cart.products
        }
        res.render('cart', testUser)

    } catch (error) {
        console.log(error)
    }
})

router.get('/realtimeproducts', (req, res) => {
    let testUser = {
        title: 'Listado de Productos dinámico',
    }
    res.render('realTimeProducts', testUser)
})

router.get('/chat', (req, res) => {
    res.render('chat', {})
})

router.get('/formcookies', (req, res) => {
    let testUser = {
        title: 'formcookies'
    }
    res.render('formcookies', testUser)
})

module.exports = router