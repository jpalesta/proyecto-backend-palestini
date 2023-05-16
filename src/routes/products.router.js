const { Router, json } = require('express')
const router = Router()

//Manager de Mongo DB
const ProductManagerDB = require('../dao/db/productManagerDB.js')

const productsModel = require('../dao/db/models/product.model.js')

//Socket
const io = require("socket.io-client")

router.get('/', async (req, res) => {
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

        const { docs, totalPages, hasPrevPage, hasNextPage, prevPage, nextPage } = products
        
        let prevLink = ''
        let nextLink = ''
        if (hasPrevPage === false) {
            prevLink = null
        } else { prevLink = `/?page=${prevPage}` }
        if (hasNextPage === false) {
            nextLink = null
        } else { nextLink = `/?page=${nextPage}` }

        res.status(200).send({
            status: 'success',
            payload: docs,
            totalPages,
            prevPage,
            nextPage,
            page,
            hasPrevPage,
            hasNextPage,
            prevLink,
            nextLink
        })
    } catch (error) {
        console.log(error)
    }
})

router.get('/:pid', async (req, res) => {
    try {
        const pid = req.params.pid
        const product = await ProductManagerDB.getProductById({ _id: pid })
        res.status(200).send({
            status: 'success',
            payload: product
        })
    } catch (error) {
        console.log(error)
    }
})

router.post('/', async (req, res) => {
    try {
        const newProduct = req.body
        console.log('clg NewProd apenas viene', newProduct)
        product = await ProductManagerDB.addProduct(newProduct)
        console.log('clg newProduct', newProduct)
        await emitProductsUpdate()
        res.status(200).send({
            status: 'success',
            payload: product
        })
    } catch (error) {
        console.log(error)
    }
})

router.put('/:pid', async (req, res) => {
    try {
        const pid = req.params.pid
        const update = req.body
        const productUpdated = await ProductManagerDB.updateProduct(pid, update)
        await emitProductsUpdate()
        res.status(200).send({
            status: 'success',
            payload: productUpdated
        })
    } catch (error) {
        console.log(error)
    }
})

router.delete('/:pid', async (req, res) => {
    try {
        const pid = req.params.pid
        const product = await ProductManagerDB.deleteProduct({ _id: pid })
        await emitProductsUpdate()
        res.status(200).send({
            status: 'success',
            payload: product
        })
    } catch (error) {
        console.log(error)
    }
})

//funcion que actualiza la lista de productos y emite el evento 
async function emitProductsUpdate() {
    const socket = io("ws://localhost:8080")
    const products = await ProductManagerDB.getProducts()
    socket.emit('productsUpdated', products.docs)
}

module.exports = router


//Manager de file
// const ProductManager = require('../dao/fileSystem/productManager')
// const product = new ProductManager()

//RUTAS CON PERSISTENCIA EN FILE

// //chequeado OK
// router.get('/', async (req, res) => {
//     try {
//         const { limit } = req.query
//         const products = await product.getProducts()
//         if (!limit) {
//             return res.send({
//                 status: 'success',
//                 payload: products
//             })
//         }
//         return res.send({
//             status: 'success',
//             payload: products.slice(0, limit)
//         })
//     } catch (error) {
    //         console.log(error)
//         return res.send({
    //             status: 'error',
    //             error: 'something was wrong'
//         })
//     }
// })
// //chequeado OK
// router.get('/:pid', async (req, res) => {
//     try {
//         const { pid } = req.params
//         const productById = await product.getProductsById(parseInt(pid))
//         if (!productById) {
//             return res.send({
//                 status: 'error',
//                 error: 'product not found'
//             })
//         }
//         res.send({
//             status: 'success',
//             payload: productById
//         })
//     } catch (error) {
//         console.log(error)
//         return res.send({ status: 'error', error: 'product not found' })
//     }
// })
// //chequeado OK
// router.post('/', async (req, res) => {
//     try {
//         let newProduct = req.body
//         await product.addProducts(newProduct)
//         let lastProductIndex = product.products.length - 1
//         let lastProductAdded = product.products[lastProductIndex]
//         await emitProductsUpdate()
//         res.send({
//             status: 'success',
//             message: 'product added OK',
//             payload: lastProductAdded
//         })
//     } catch (error) {
//         return res.status(400).send({
//             status: 'error',
//             message: error
//         })
//     }
// })
// //chequeado OK
// router.put('/:pid', async (req, res) => {
//     try {
//         const { pid } = req.params
//         const update = req.body
//         await product.updateProduct(parseInt(pid), update)
//         await emitProductsUpdate()
//         res.send({
//             status: 'success',
//             message: 'product modified OK'
//         })
//     } catch (error) {
//         return res.status(400).send({
//             status: 'error',
//             message: error
//         })
//     }
// })

// router.delete('/:pid', async (req, res) => {
//     try {
//         const { pid } = req.params
//         await product.deleteProduct(parseInt(pid))
//         await emitProductsUpdate()
//         res.send({
//             status: 'success',
//             message: 'product deleted OK'
//         })
//     } catch (error) {

//         return res.send({
//             status: 'error',
//             error: 'product to delete not found'
//         })
//     }
// })

// //funcion que actualiza la lista de productos y emite el evento
// async function emitProductsUpdate() {
//     const socket = io("ws://localhost:8080")
//     const products = await product.getProducts()
//     socket.emit('productsUpdated', products)
// }