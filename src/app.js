const express = require('express')
const handlebars = require('express-handlebars')
const { Server } = require('socket.io')
const cookieParser = require('cookie-parser')
const passport = require('passport')
const cors = require ('cors')
const multer = require('multer')

require('dotenv').config()

// const routerApp = require('./routes')
const {uploaderUsers, uploaderProducts, multerUpload} = require('./utils/multer.js')
const chatManagerDB = require('./dao/db/chatManagerDB')
const {
    initPassportGithub,
    initPassportLocal,
    initPassportJWT,
} = require('./config/passport.config')
const { errorHandler } = require('./Middlewares/error.midlewares')
const { addlogger } = require('./Middlewares/logger.middleware')
const { logger } = require('./utils/logger')
const { socketIoSetup } = require('./utils/socketIo')
const { default: mongoose } = require('mongoose')

//configuracion express + socketserver
const app = express()
const port = process.env.PORT

//conexión a Mongo para deploy
const connection = mongoose.connect(process.env.MONGO_URL)

//configuración de socke.io
const server = app.listen(port, () => {
    logger.info(`Listening on port ${port}`)
})
const io = new Server(server)
socketIoSetup(io)

//midleware de logger
app.use(addlogger)


//configuracion de CORS
const corsOptions = {
    origin: 'http://localhost:8080',
    methods: 'GET, POST, PUT, DELETE',
    allowedHeaders: 'Content-Type, Authorization'
}

app.use(cors(corsOptions))

//configuracion para que express reconozca formatos
app.use(express.json())
app.use(express.urlencoded({ extended: true }))

//Inicialización cookie-parser
app.use(cookieParser())
passport.use(passport.initialize())

//passport GitHub
initPassportGithub()

//passport Local
initPassportLocal()

//init passport JWT
initPassportJWT()

//importacion de rutas de index routes
app.use(routerApp)

//configuración y prueba de handlebars
app.engine('handlebars', handlebars.engine())
app.set('views', __dirname + '/views')
app.set('view engine', 'handlebars')




//Prueba de Multer
app.post('/single', (req, res) => {
    multerUpload (req, res, function (err) {
        if (err instanceof multer.MulterError){
            res.send(err)
        } else if (err) {
            res.send(err)
        } 
        console.log('req.file', req.file);
        res.status(200).send({
            status: 'success',
            message: 'product loaded ok',
    })
    })
})
// app.post('/single', multerUpload.single('identificatio'), (req, res) => {
//     console.log('req.file', req.file);
//     res.status(200).send({
//         status: 'success',
//         message: 'product loaded ok',
//     })
// })


//middleware de manejo de errores
// app.use(errorHandler)

