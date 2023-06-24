const ProductManagerDB = require('../dao/db/productManagerDB')
const CartManagerDB = require('../dao/db/cartManagerDB')

const productsModel = require('../dao/db/models/product.model.js')


class ViewsController {

    loginRedirect =  (req, res) => {
        res.redirect('/login')
    }

    viewAllProducts = async (req, res) => {
        try {
            let page = req.query.page
            if (page === undefined) {
                page = 1
            }
            page = parseInt(page)
            if (isNaN(page)) {
                res.send({
                    status: 'error',
                    message: 'The page value is NaN',
                })
                return
            }
            const limit = parseInt(req.query.limit) || 10
            const sort = req.query.sort
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
                const existingCategory = await productsModel.distinct('category', {
                    category,
                })
                if (existingCategory.length === 0) {
                    throw new Error('The specified category does not exist')
                }
                query.category = category
            }
            if (availability === 'true') {
                query.stock = { $gt: 0 }
            } else {
                ;('')
            }
            //hacer 1° llamado solo con limit y comparar
            const result = await ProductManagerDB.getProducts(
                page,
                limit,
                sortOptions,
                query
            )
            const { totalPages } = result
            if (page > totalPages) {
                res.send({
                    status: 'error',
                    message: 'The page value is too high',
                })
            }
            const products = await ProductManagerDB.getProducts(
                page,
                limit,
                sortOptions,
                query
            )
            const { docs, hasPrevPage, hasNextPage, prevPage, nextPage } = products
            const currentURL =
                req.protocol + '://' + req.get('host') + req.originalUrl
            const prevLink = hasPrevPage
                ? createLink(currentURL, page, prevPage)
                : null
            const nextLink = hasNextPage
                ? createLink(currentURL, page, nextPage)
                : null
    
            console.log('req.userview',req.user);
            let userLoged = req.user
            
            let testUser = {
                firstName: userLoged.user.firstName,
                lastName: userLoged.user.lastName,
                role: userLoged.user.role,
                title: 'Lista de Productos',
                products: docs,
                hasPrevPage,
                hasNextPage,
                prevPage,
                nextPage,
                prevLink,
                nextLink,
            }
            res.render('index', testUser)
        } catch (error) {
            console.log(error)
            return res.send({ status: 'error', message: 'something was wrong' })
        }
        function createLink(currentURL, page, newPage) {
            const newURL = currentURL.includes('page')
                ? currentURL.replace('page=' + page, 'page=' + newPage)
                : currentURL + '?&page=' + newPage
            return newURL
        }
    }

    viewOneCart = async (req, res) => {
        try {
            const cid = req.params.cid
            const cart = await CartManagerDB.getCartByIdPopulate({ _id: cid })
            if (cart.products.length === 0) {
                let testUser = {
                    title: `Cart Number ${cart._id} is empty`,
                }
                res.render('cart', testUser)
            }
            let testUser = {
                title: `Cart Number ${cart._id}`,
                products: cart.products,
            }
            res.render('cart', testUser)
        } catch (error) {
            console.log(error)
        }
    }

    viewProductsRealtime = (req, res) => {
        let testUser = {
            title: 'Listado de Productos dinámico',
        }
        res.render('realTimeProducts', testUser)
    }

    viewChat = (req, res) => {
        res.render('chat', {})
    }

    viewFormCookies = (req, res) => {
        let testUser = {
            title: 'formcookies',
        }
        res.render('formcookies', testUser)
    }

    viewRegister = (req, res) => {
        res.render('registerForm')
    }

    viewLogin = (req, res) => {
        res.render('login')
    }

    viewRestorePass = (req, res) => {
        res.render('restorePass')
    }
}

module.exports = new ViewsController