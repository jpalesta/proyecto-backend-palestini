const express = require('express')

const productsRouter = require('./routes/products.router.js')
const cartsRouter = require('./routes/carts.router.js')
const uploader = require('./utils.js')

const app = express()
const port = 8080


//configuración y prueba de handlebars
// const handlebars = require('express-handlebars')
// app.engine( 'handlebars', handlebars.engine())
// app.set('views', __dirname+'/views')
// app.set('view engine', 'handlebars')
// app.get('/vista', (req, res) =>{

//     let testUser = {
//         name: 'toto'
//     }
//     res.render('index', testUser)
// })

app.use(express.json())
app.use(express.urlencoded({ extended: true }))

app.use('/static',express.static(__dirname+'/public'))

app.use('/api/products', productsRouter)
app.use('/api/carts', cartsRouter)

//Prueba de Multer
app.post('/single', uploader.single('product.file'), (req, res) =>{
    res.status(200).send({
        status: 'success',
        message: 'product loaded ok'
    })
})
app.use((err, req, res ,next)=>{
    console.log('clg error en app',err)
    res.status(500).send('something is wrong')
})


app.listen(port, () => {
    console.log(`escuchando el puerto ${port}`)
})