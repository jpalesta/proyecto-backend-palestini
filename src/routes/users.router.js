const { Router } = require('express')
const { 
    getAll, 
    create, 
    roleChange 
} = require('../controllers/users.controller')

const router = Router()

router.get('/', getAll)

router.post('/', create)

router.post('/premium/:uid', roleChange )

module.exports = router
