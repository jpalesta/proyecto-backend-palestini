const { Router } = require('express')
const multer = require('multer')

const {
    getAll,
    create,
    roleChange,
    userDocsUpload,
    deleteInactiveUsers,
} = require('../controllers/users.controller')
const { uploaderUsers } = require('../utils/multer')
const { passportAutorization } = require('../Middlewares/passportAutorization')
const {
    passportAuthentication,
} = require('../Middlewares/passportAuthentication')

const fields = [
    { name: 'identification' },
    { name: 'proofOfAddress' },
    { name: 'statementOfAccount' },
    { name: 'profileImage' },
]

const router = Router()

router.get('/', getAll)

router.post('/', create)

router.delete('/', deleteInactiveUsers)

router.post(
    '/:uid/documents',
    passportAuthentication('jwt'),
    passportAutorization(['user', 'admin', 'premium']),
    uploaderUsers.fields(fields),
    (req, res, next) => {
        next()
    },
    userDocsUpload
)

router.post('/premium/:uid', roleChange)

module.exports = router
