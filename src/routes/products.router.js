const { Router } = require('express')
const router = Router()

const { isAuthenticated } = require('../Middlewares/authentication.middlewares.js')

const { getAll,
            getOne,
            create,
            update,
            deleteOne
} = require('../controllers/products.controller.js')


//Trae todos los productos con pagination + querys chequeado OK
router.get('/', isAuthenticated, getAll)

//Trae un producto por ID chequeado OK
router.get('/:pid', getOne)

//Crea un producto por body chequeado con validación de body OK
router.post('/', create)

//Modifica un producto por body chequeado OK (falta validación de body)
router.put('/:pid', update)

//borra un producto por id chequeado OK
router.delete('/:pid', deleteOne)

//funcion que actualiza la lista de productos y emite el evento 


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