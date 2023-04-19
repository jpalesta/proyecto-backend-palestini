const express = require('express')

const productsRouter = require('./routes/products.router.js')
const cartsRouter = require('./routes/carts.router.js')
const viewsRouter = require('./routes/views.router.js')
const uploader = require('./utils/multer.js')
const handlebars = require('express-handlebars')
const { Server } = require('socket.io')

//configuracion express + socketserver
const app = express()
const port = 8080
const server = app.listen(port, () => {
    console.log(`Listening on port ${port}`)
})
const io = new Server(server)

io.on('connection', (socket) => {
    console.log('new client connect')
    socket.on('productsUpdated', (data) => {
        io.emit('updatedProductsUi', data)
    })
})
//configuración y prueba de handlebars
app.engine('handlebars', handlebars.engine())
app.set('views', __dirname + '/views')
app.set('view engine', 'handlebars')

//configuracion para que express reconozca formatos
app.use(express.json())
app.use(express.urlencoded({ extended: true }))

//configuracion de carpeta public
app.use('/static', express.static(__dirname + '/public'))

//configuracion de routers
app.use('/api/products', productsRouter)
app.use('/api/carts', cartsRouter)
app.use('/', viewsRouter)

//Prueba de Multer
app.post('/single', uploader.single('product.file'), (req, res) => {
    res.status(200).send({
        status: 'success',
        message: 'product loaded ok'
    })
})
app.use((err, req, res, next) => {
    console.log('clg error en app', err)
    res.status(500).send('something is wrong')
})
