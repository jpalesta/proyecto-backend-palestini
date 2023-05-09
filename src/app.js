const express = require('express')

const routerApp = require('./routes')

const uploader = require('./utils/multer.js')
const handlebars = require('express-handlebars')
const { Server } = require('socket.io')
const objectConfig = require('./config/objectConfig.js')
const chatManagerDB = require('./dao/db/chatManagerDB')

//conexión DB Mogoose
objectConfig.connectDB()

//configuracion express + socketserver
const app = express()
const port = 8080

//configuracion para que express reconozca formatos
app.use(express.json())
app.use(express.urlencoded({ extended: true }))


//importacion de rutas de index routes
app.use(routerApp)

//configuración y prueba de handlebars
app.engine('handlebars', handlebars.engine())
app.set('views', __dirname + '/views')
app.set('view engine', 'handlebars')


//configuracion de carpeta public
app.use('/static', express.static(__dirname + '/public'))

//Prueba de Multer
app.post('/single', uploader.single('product.file'), (req, res) => {
    res.status(200).send({
        status: 'success',
        message: 'product loaded ok'
    })
})

//middleware de manejo de errores
app.use((err, req, res, next) => {
    console.log('clg error en app', err)
    res.status(500).send('something is wrong')
})

//configuración de socke.io
const server = app.listen(port, () => {
    console.log(`Listening on port ${port}`)
})
const io = new Server(server)
io.on('connection', (socket) => {
    console.log('new client connect')
    socket.on('productsUpdated', (data) => {
        io.emit('updatedProductsUi', data)
        console.log('productos enviados a realtime', data)
    })
    socket.on('newUserConnected', data => {
        socket.broadcast.emit('newUserConnectedToast', data)
    })
    socket.on('newMessage', async newMessage => {
        console.log('clg newMessage', newMessage)
        await chatManagerDB.addMessage(newMessage)
        logs = await chatManagerDB.getmessages()
        io.emit('completeLogs', logs)
        console.log('logs',logs)
    })
})

