const multer = require('multer')
const { logger } = require('../utils/logger')

const storage = multer.diskStorage({
    destination: function (req, file, cb) {
        cb(null, `${__dirname}/public/uploads`)
    },
    filename: function (req, file, cb) {
        cb(null, file.originalname)
    },
})

const uploader = multer({
    storage,
    onError: function (err, next) {
        logger.error('error en uploader', err)
        next()
    },
})

module.exports = uploader
