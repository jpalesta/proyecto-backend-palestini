const mongoose = require('mongoose')

const productValidate = require('../Middlewares/validation/product.validator')
const { productsService } = require('../service/index.js')
const { logger } = require('../utils/logger');

class ProductController {

    //Problemas con Paginate
    getAllPaginate = async (req, res) => {
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
                const existingCategory = await productsService.distinct('category', { category })
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
            const result = await productsService.getProductsPaginate(page, limit, sortOptions, query)
            const { totalPages } = result
            if (page > totalPages) {
                res.send({
                    status: 'error',
                    message: 'The page value is too high'
                })
            }

            const products = await productsService.getProductsPaginate(page, limit, sortOptions, query)
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
            logger.error(error)
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
            logger.error(error)
        }
    }

    create = async (req, res) => {
        try {
            const newProduct = req.body
            const isValid = productValidate(newProduct);
            console.log('req.user en create', req.user)
            if (!isValid) {
                return res.status(400).send({
                    status: 'error',
                    message: 'Formato de datos inválido',
                    error: productValidate.errors[0].message
                });
            }
            const creatorRole = req.user.user.role
            if (creatorRole === 'premium') {
                newProduct.owner = req.user.user._id
            }
            console.log('newProduct con owner', newProduct)

            let product = await productsService.createProduct(newProduct)
            console.log('product', product)
            await productsService.emitProductsUpdate()
            res.status(200).send({
                status: 'success',
                payload: product
            })
        } catch (error) {
            logger.error(error)
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
            const productToUpdate = await productsService.getProduct({ _id: pid })
            const productToUpdateOwnerID = productToUpdate.owner.toString()
            const userProductToUpdate = req.user.user._id

            if (userProductToUpdate === productToUpdateOwnerID) {
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
            }
            const userToUpdateRole = req.user.user.role

            if (userToUpdateRole === 'admin') {
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
            } else {
                res.status(401).send({
                    status: 'error',
                    message: 'You don´t have permission to update or delete this product'
                })
            }
        } catch (error) {
            logger.error(error)
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
            const productToDelete = await productsService.getProduct({ _id: pid })
            const productToDeleteOwnerID = productToDelete.owner.toString()
            const userProductToDelete = req.user.user._id

            if (userProductToDelete === productToDeleteOwnerID) {
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
            }
            const userToDeleteRole = req.user.user.role

            if (userToDeleteRole === 'admin') {
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
            } else {
                res.status(401).send({
                    status: 'error',
                    message: 'You don´t have permission to update or delete this product'
                })
            }
        } catch (error) {
            logger.error(error)
        }
    }

}

module.exports = new ProductController