const express = require('express')
const ProductManager = require ('./productManager')

const app = express()
const port = 8080
const product = new ProductManager()

app.use(express.json())
app.use(express.urlencoded({ extended: true }))

app.get('/products', async (req, res) => {
    try {
        const { limit } = req.query
        const products = await product.getProducts()
        if (!limit) {
            return res.send({
                status: 'success',
                result: products
            })
        }
        return res.send({
            status: 'success',
            result: products.slice(0, limit)
        })

    } catch (error) {
        console.log(error)
    }
})

app.get('/products/:pid', async (req, res) => {
    try {
        const { pid } = req.params
        const productDb = await product.getProductsById(parseInt (pid))
        if(!productDb){
            return res.send({status: 'error', error: 'product not found'})
        }
        res.send({productDb})
    } catch (error) {
        console.log(error)
        return res.send({status: 'error', error: 'product not found'})
    }
})

app.listen(port, () => {
    console.log(`escuchando el puerto ${port}`)
})