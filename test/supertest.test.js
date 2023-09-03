const chai = require('chai')
const supertest = require('supertest')
require('dotenv').config()

const expect = chai.expect
const requester = supertest('http://localhost:8080')

const { logger } = require('../src/utils/logger')

const { productsService, usersService } = require('../src/service/index')

describe('Testing de Ecommerce Jose.Palestini', () => {
    let cookie

    before(async function () {
        this.timeout(10000)
        try {
            let userMail = { email: 'usuarioprueba@gmail.com' }
            let productCode = { code: 'PRUEBA01' }
            const existingUser = await usersService.getUser(userMail)
            const existingProduct = await productsService.getProductByCode(
                productCode
            )
            if (existingUser) {
                await usersService.delete(userMail)
            }
            if (existingProduct) {
                await productsService.deleteByCode(productCode)
            }
        } catch (error) {
            logger.error('error en borrar el usuario', error)
        }
    })

    describe('Test de Session', () => {
        it('Debe registrar un usuario correctamente', async () => {
            let userMock = {
                firstName: 'nombreDePrueba',
                lastName: 'apellidoDePrueba',
                role: 'premium',
                email: 'usuarioprueba@gmail.com',
                dateOfBirth: '2000-01-01',
                password: '123456',
            }
            const response = await requester
                .post('/api/session/register')
                .send(userMock)
            if (response.statusCode === 302) {
                const redirectUrl = response.header['location']
                const response1 = await requester.get(redirectUrl).redirects(0)
                expect(response1.statusCode).to.be.equal(200)
            } else {
                expect(response.statusCode).to.be.equal(200)
            }
        })
        it('Debe logear un usuario correctamente y setear una cookie con sus datos en headers', async () => {
            let loginMock = {
                email: 'usuarioprueba@gmail.com',
                password: '123456',
            }
            const response = await requester
                .post('/api/session/login')
                .send(loginMock)
            const cookieResponse = response.headers['set-cookie'][0]
            expect(cookieResponse).to.be.ok
            cookie = {
                name: cookieResponse.split('=')[0],
                value: cookieResponse.split('=')[1],
            }
        })
        it('Debe hacer un logout y borrar la cookie', async () => {
            const response = await requester.get('/api/session/logout')
            expect(response.headers['set-cookie']).to.be.undefined
        })
    })

    describe('Test de productos', () => {
        it('El endpoint de POST /api/products debe crear un producto', async () => {
            let productMock = {
                title: 'Producto de Prueba',
                description: 'Descripción de Prueba',
                price: 10000,
                code: 'PRUEBA01',
                stock: 1,
                category: 'Categoría de Prueba',
                status: true,
            }
            const response = await requester
                .post('/api/products')
                .set('Cookie', [`${cookie.name}=${cookie.value}`])
                .send(productMock)
            expect(response._body).to.have.property('payload')
            expect(response.statusCode).to.be.equal(200)
        })
        it('El endpoint de GET /api/products debe traer todos los productos', async () => {
            const { _body } = await requester
                .get('/api/products')
                .set('Cookie', [`${cookie.name}=${cookie.value}`])
            expect(_body).to.have.property('payload')
        })

        it('El endpoint de GET /api/products/:uid debe traer un producto', async () => {
            let pid = '64c6fd8e99eed300ab6d43c2'
            const { _body, statusCode } = await requester.get(
                `/api/products/${pid}`
            )
            expect(statusCode).to.be.equal(200)
            expect(_body).to.have.property('payload')
            const payload = _body.payload
            expect(payload).to.not.be.empty // Verificar que el payload no está vacío
            expect(payload).to.have.property('_id')
        })
    })

    describe('Test de carritos', () => {
        it('El endpoint de POST /api/carts debe crear un carrito vacío', async () => {
            const response = await requester.post('/api/carts')
            expect(response.statusCode).to.equal(200)
            expect(response.body).to.have.property('payload')
            expect(response.body.payload).to.be.an('array').that.is.empty
        })
        it('El endpoint de POST /api/carts/:cid/products/:pid debe ver si el producto informado ya existe en el carrito, si existe aumenta la cantidad en 1 y si no, lo agrega con cantidad 1', async () => {
            let pid = '64c6fda999eed300ab6d43c6'
            let cid = '64a889f0efdbf57d4efda0ea'
            const { _body, statusCode } = await requester
                .post(`/api/carts/${cid}/products/${pid}`)
                .set('Cookie', [`${cookie.name}=${cookie.value}`])
            expect(statusCode).to.be.equal(200)
        })
        it('El endpoint de DELETE /api/carts/:cid/products/:pid debe borrar el producto informado del carrito informado ', async () => {
            let pid = '64c6fda999eed300ab6d43c6'
            let cid = '64a889f0efdbf57d4efda0ea'
            const response = await requester
                .delete(`/api/carts/${cid}/products/${pid}`)
                .set('Cookie', [`${cookie.name}=${cookie.value}`])
            expect(response.statusCode).to.be.equal(200)
            const getCartResponse = await requester
                .get(`/api/carts/${cid}`)
            expect(getCartResponse.body.payload.products.some(product => product.product._id === pid)).to.be.false
        })
    })
})
