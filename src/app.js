const express = require('express')
const productRouter = require('./routes/products.router.js')

const app = express()
const port = 8080

app.use(express.json())
app.use(express.urlencoded({ extended: true }))

app.use('/api/products', productRouter)



app.listen(port, () => {
    console.log(`escuchando el puerto ${port}`)
})