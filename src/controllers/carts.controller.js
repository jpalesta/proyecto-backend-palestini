const mongoose = require('mongoose')
const { faker } = require('@faker-js/faker')

const { sendMail } = require('../utils/sendMail')
const { sendSms } = require('../utils/sendSms')
const { logger } = require('../utils/logger')

const cartValidate = require('../Middlewares/validation/cart.validator')
const {
    cartsService,
    productsService,
    ticketsService,
} = require('../service/index.js')

class CartController {
    getAll = async (req, res) => {
        try {
            const carts = await cartsService.getCarts()
            res.status(200).send({
                status: 'success',
                payload: carts,
            })
        } catch (error) {
            logger.error(error)
        }
    }

    getOne = async (req, res) => {
        try {
            const cid = req.params.cid
            if (!mongoose.Types.ObjectId.isValid(cid)) {
                return res.status(400).send({
                    status: 'error',
                    message: 'Invalid cart ID format',
                })
            }
            const cart = await cartsService.getCartPopulate({ _id: cid })
            if (!cart) {
                res.status(404).send({
                    status: 'error',
                    message: `The cart number ${cid} does not exist`,
                })
            }
            if (cart.products.length === 0) {
                res.status(200).send({
                    status: 'success',
                    message: `The cart number ${cid} is empty`,
                })
            }
            res.status(200).send({
                status: 'success',
                payload: cart,
            })
        } catch (error) {
            logger.error(error)
        }
    }

    create = async (req, res) => {
        try {
            const newCart = []
            const cart = await cartsService.createCart(newCart)
            res.status(200).send({
                status: 'success',
                payload: cart,
            })
        } catch (error) {
            logger.error(error)
        }
    }

    createWithBody = async (req, res) => {
        try {
            const newCart = req.body
            const isValid = cartValidate(newCart)
            if (!isValid) {
                return res.status(400).send({
                    status: 'error',
                    message: 'Formato de datos inválido',
                    error: cartValidate.errors[0].message,
                })
            }
            const cart = await cartsService.createCart(newCart)
            if (Object.keys(cart).length === 0) {
                res.status(400).send({
                    status: 'error',
                    message:
                        'The product ID is wrong, please check your information',
                })
            }

            res.status(200).send({
                status: 'success',
                payload: cart,
            })
        } catch (error) {
            logger.error(error)
        }
    }

    update = async (req, res) => {
        try {
            const cid = req.params.cid
            if (!mongoose.Types.ObjectId.isValid(cid)) {
                return res.status(400).send({
                    status: 'error',
                    message: 'Invalid cart ID format',
                })
            }

            const pid = req.params.pid
            if (!mongoose.Types.ObjectId.isValid(pid)) {
                return res.status(400).send({
                    status: 'error',
                    message: 'Invalid product ID format',
                })
            }

            const cartToUpdate = await cartsService.getCart({ _id: cid })
            if (!cartToUpdate) {
                return res.status(401).send({
                    status: 'error',
                    message:
                        'The cart selected doesn´t exist, please check the cart number',
                })
            }

            const productToUpdate = await productsService.getProduct({
                _id: pid,
            })
            if (!productToUpdate) {
                return res.status(401).send({
                    status: 'error',
                    message:
                        'The product selected doesn´t exist, please check the product number',
                })
            }
            const userId = req.user.user._id
            const productToUpdateOwner = productToUpdate.owner.toString()

            if (productToUpdateOwner === userId) {
                throw new Error('You can´t add your own products to the cart')
            } else {
                const cart = await cartsService.updateProductInCart(cid, pid)
                res.status(200).send({
                    status: 'success',
                    payload: cart,
                })
            }
        } catch (error) {
            return res.status(400).send({
                status: 'error',
                message: error.message,
            })
        }
    }

    updateWithBody = async (req, res) => {
        try {
            const cid = req.params.cid
            if (!mongoose.Types.ObjectId.isValid(cid)) {
                return res.status(400).send({
                    status: 'error',
                    message: 'Invalid cart ID format',
                })
            }

            const pid = req.params.pid
            if (!mongoose.Types.ObjectId.isValid(pid)) {
                return res.status(400).send({
                    status: 'error',
                    message: 'Invalid product ID format',
                })
            }

            const userId = req.user.user._id

            let quantity = req.body.quantity
            if (!quantity) {
                quantity = 1
            }

            const cartToUpdate = await cartsService.getCart({ _id: cid })
            if (!cartToUpdate) {
                return res.status(401).send({
                    status: 'error',
                    message:
                        'The cart selected doesn´t exist, please check the cart number',
                })
            }

            const productToUpdate = await productsService.getProduct({
                _id: pid,
            })
            const productToUpdateOwner = productToUpdate.owner.toString()
            if (productToUpdateOwner === userId) {
                return res.status(401).send({
                    status: 'error',
                    message: 'You can´t add your own products to the cart',
                })
            }

            const cart = await cartsService.updateQuantityProductInCart(
                cid,
                pid,
                quantity
            )

            res.status(200).send({
                status: 'success',
                payload: cart,
            })
        } catch (error) {
            logger.error(error)
        }
    }

    deleteAll = async (req, res) => {
        try {
            const cid = req.params.cid
            if (!mongoose.Types.ObjectId.isValid(cid)) {
                return res.status(400).send({
                    status: 'error',
                    message: 'Invalid cart ID format',
                })
            }
            const cart = await cartsService.deleteOne(cid)
            logger.error(cart)
            if (cart === undefined) {
                return res.status(404).send({
                    status: 'error',
                    message: `The cart number ${cid} does not exist`,
                })
            } else {
                res.status(200).send({
                    status: 'success',
                    message: `The cart ${cart._id} was emptied successfully `,
                })
            }
        } catch (error) {
            logger.error(error)
        }
    }

    deleteProduct = async (req, res) => {
        try {
            const cid = req.params.cid
            if (!mongoose.Types.ObjectId.isValid(cid)) {
                return res.status(400).send({
                    status: 'error',
                    message: 'Invalid cart ID format',
                })
            }
            const pid = req.params.pid
            if (!mongoose.Types.ObjectId.isValid(pid)) {
                return res.status(400).send({
                    status: 'error',
                    message: 'Invalid product ID format',
                })
            }
            const cartById = await cartsService.getCart({ _id: cid })
            if (!cartById) {
                return res.status(404).send({
                    status: 'error',
                    message: `The cart number ${cid} does not exist`,
                })
            }
            {
                const product = cartById.products.find(
                    (product) => product.product._id.toString() === pid
                )
                if (!product) {
                    return res.status(400).send({
                        status: 'error',
                        message: `Product number ${pid} not found in the cart`,
                    })
                }
            }
            {
                await cartsService.deleteProduct({ _id: cid }, { _id: pid })
                res.status(200).send({
                    status: 'success',
                    message: `The cart ${cartById._id} was modified OK `,
                })
            }
        } catch (error) {
            logger.error(error)
        }
    }

    updateProduct = async (req, res) => {
        try {
            const cid = req.params.cid
            if (!mongoose.Types.ObjectId.isValid(cid)) {
                return res.status(400).send({
                    status: 'error',
                    message: 'Invalid cart ID format',
                })
            }
            const update = req.body
            const cartUpdated = await cartsService.updateCart(cid, update)
            if (cartUpdated.matchedCount === 0) {
                res.status(400).send({
                    status: 'error',
                    message: `Product ${cid} not found in Data Base`,
                })
            }
            res.status(200).send({
                status: 'success',
                payload: cartUpdated,
            })
        } catch (error) {
            logger.error(error)
        }
    }

    updateProductQuantity = async (req, res) => {
        try {
            const cid = req.params.cid
            if (!mongoose.Types.ObjectId.isValid(cid)) {
                return res.status(400).send({
                    status: 'error',
                    message: 'Invalid cart ID format',
                })
            }
            const pid = req.params.pid
            if (!mongoose.Types.ObjectId.isValid(pid)) {
                return res.status(400).send({
                    status: 'error',
                    message: 'Invalid product ID format',
                })
            }
            const quantity = req.body.quantity
            const cartUpdated = await cartsService.updateCart(
                cid,
                pid,
                quantity
            )
            res.status(200).send({
                status: 'success',
                payload: cartUpdated,
            })
        } catch (error) {
            logger.error(error)

            res.status(400).send({
                status: 'error',
                message: error.message,
            })
        }
    }

    purchase = async (req, res) => {
        try {
            const cid = req.params.cid
            if (!mongoose.Types.ObjectId.isValid(cid)) {
                return res.status(400).send({
                    status: 'error',
                    message: 'Invalid cart ID format',
                })
            }
            let cart = await cartsService.getCartPopulate({ _id: cid })
            if (!cart) {
                res.status(404).send({
                    status: 'error',
                    message: `The cart number ${cid} does not exist`,
                })
            }
            if (cart.products.length === 0) {
                res.status(200).send({
                    status: 'success',
                    message: `The cart number ${cid} is empty`,
                })
            }
            //defino que productos tienen stock
            const productsForTicket = cart.products.filter((product) => {
                return product.product.stock >= product.quantity
            })

            if (productsForTicket.length > 0) {
                //descuento de la compra del stock y del cart
                for (let i = 0; i < productsForTicket.length; i++) {
                    const item = productsForTicket[i]
                    let pid = item.product._id
                    let newQuantity = item.product.stock - item.quantity
                    let update = { stock: newQuantity }
                    await productsService.updateProduct(pid, update)
                    await cartsService.deleteProduct(cid, pid)
                }

                const fakerCode = faker.string.alphanumeric(10)
                const code = fakerCode.slice(0, 10)
                const amount = productsForTicket.reduce(
                    (amountTicket, items) => {
                        return (
                            amountTicket + items.quantity * items.product.price
                        )
                    },
                    0
                )
                const purchaser = req.user.user.email
                const newTicket = {
                    code: code,
                    amount: amount,
                    purchaser: purchaser,
                }
                const mailSubject = `${purchaser} your purchase was processed successfully`
                const tableRows = productsForTicket
                    .map((item) => {
                        const { product, quantity } = item
                        return `<tr>
                                    <td>${product.description}</td>
                                    <td>${product.price}</td>
                                    <td>${quantity}</td>
                                </tr>`
                    })
                    .join('')
                cart = await cartsService.getCartPopulate({ _id: cid })

                const tableRowsMissing = cart.products
                    .map((item) => {
                        const { product, quantity } = item
                        return `<tr>
                                    <td>${product.description}</td>
                                    <td>${product.price}</td>
                                    <td>${quantity}</td>
                                </tr>`
                    })
                    .join('')

                let html = ` <div>
                <h1>Ticket generado por un total de $${amount}</h1>
                <table>
                <thead>
                    <tr>
                    <th>Descripción</th>
                    <th>Precio</th>
                    <th>Cantidad</th>
                    </tr>
                </thead>
                <tbody>
                    ${tableRows}
                </tbody>
                </table>
                <h3>Los siguientes productos no cuentan con stock</h3>
                <table>
                <thead>
                    <tr>
                    <th>Descripción</th>
                    <th>Precio</th>
                    <th>Cantidad</th>
                    </tr>
                </thead>
                <tbody>
                    ${tableRowsMissing}
                </tbody>
                </table>
            </div>`

                const ticket = await ticketsService.createTicket(newTicket)

                await sendMail(purchaser, mailSubject, html)

                await sendSms(req.user.user.firstName, req.user.user.lastName)

                res.status(200).send({
                    status: 'success',
                    message: 'purchase made successfully',
                    payload: ticket,
                })
            } else {
                logger.warning('there are no products for the ticket')
                res.status(400).send({
                    status: 'error',
                    message: 'No hay productos disponibles para facturar',
                })
            }
        } catch (error) {
            logger.error(error)
        }
    }
}

module.exports = new CartController()
