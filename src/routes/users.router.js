const { Router } = require('express')
const {
    getAll,
    create,
    roleChange,
    userDocsUpload
} = require('../controllers/users.controller')

const router = Router()

router.get('/', getAll)

router.post('/', create)

router.post('/:uid/documents', userDocsUpload)

router.post('/premium/:uid', roleChange)

module.exports = router
