const { Router } = require ('express')
const ProductManager = require ('../productManager')

const router = Router ()
const product = new ProductManager()


router.get('/', async (req, res) =>{
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

router.get('/:pid', async (req, res) => {
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

module.exports = router