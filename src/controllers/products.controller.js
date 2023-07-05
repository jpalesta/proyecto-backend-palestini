const mongoose = require('mongoose')

const productValidate = require('../Middlewares/validation/product.validator')
const { productsService } = require('../service/index.js')

class ProductController {

    //Problemas con Paginate
    getAll = async (req, res) => {
        try {
            let page = req.query.page
            if (page === undefined) {
                page = 1
            }
            page = parseInt(page)
            if (isNaN(page)) {
                res.send({
                    status: 'error',
                    message: 'The page value is NaN'
                })
                return
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
            const result = await productsService.getProducts(page, limit, sortOptions, query)
            console.log('result en getall', result)
            const { totalPages } = result
            if (page > totalPages) {
                res.send({
                    status: 'error',
                    message: 'The page value is too high'
                })
            }

            const products = await productsService.getProducts(page, limit, sortOptions, query)

            const { docs, hasPrevPage, hasNextPage, prevPage, nextPage } = products

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
    }

    //Check ok mongo (falta file)
    getOne = async (req, res) => {
        try {
            const pid = req.params.pid
            if (!mongoose.Types.ObjectId.isValid(pid)) {
                return res.status(400).send({
                    status: 'error',
                    message: 'Invalid product ID format'
                })
            }
            const product = await productsService.getProduct({ _id: pid })
            if (!product) {
                res.status(400).send({
                    status: 'error',
                    message: `Product ${pid} not found in Data Base`
                })
            }
            res.status(200).send({
                status: 'success',
                payload: product
            })
        } catch (error) {
            console.log(error)
        }
    }

    create = async (req, res) => {
        try {
            const newProduct = req.body
            const isValid = productValidate(newProduct);
            if (!isValid) {
                return res.status(400).send({
                    status: 'error',
                    message: 'Formato de datos inválido',
                    error: productValidate.errors[0].message
                });
            }
            let product = await productsService.createProduct(newProduct)
            await productsService.emitProductsUpdate()
            res.status(200).send({
                status: 'success',
                payload: product
            })
        } catch (error) {
            console.log(error)
        }
    }

    update = async (req, res) => {
        try {
            const pid = req.params.pid
            if (!mongoose.Types.ObjectId.isValid(pid)) {
                return res.status(400).send({
                    status: 'error',
                    message: 'Invalid product ID format'
                })
            }
            const update = req.body
            const productUpdated = await productsService.updateProduct(pid, update)
            if (productUpdated.matchedCount === 0) {
                res.status(400).send({
                    status: 'error',
                    message: `Product ${pid} not found in Data Base`
                })
            }
            await productsService.emitProductsUpdate()
            res.status(200).send({
                status: 'success',
                payload: productUpdated
            })
        } catch (error) {
            console.log(error)
        }
    }

    deleteOne = async (req, res) => {
        try {
            const pid = req.params.pid
            if (!mongoose.Types.ObjectId.isValid(pid)) {
                return res.status(400).send({
                    status: 'error',
                    message: 'Invalid product ID format'
                })
            }
            const product = await productsService.deleteOne({ _id: pid })
            if (product.deletedCount === 0) {
                res.status(400).send({
                    status: 'error',
                    message: `Product ${pid} not found in Data Base`
                })
            }
            await emitProductsUpdate()
            res.status(200).send({
                status: 'success',
                payload: product
            })
        } catch (error) {
            console.log(error)
        }
    }

}

module.exports = new ProductController