const express = require('express')

const productsRouter = require('./routes/products.router.js')
const cartsRouter = require('./routes/carts.router.js')

const app = express()
const port = 8080


app.use(express.json())
app.use(express.urlencoded({ extended: true }))

app.use('/api/products', productsRouter)
app.use('/api/carts', cartsRouter)



app.listen(port, () => {
    console.log(`escuchando el puerto ${port}`)
})