const multer = require('multer')
const path = require('node:path')

const { logger } = require('../utils/logger')

const currentDir = path.join(__dirname, '../public')


const uploaderUsers = multer({
    storage: multer.diskStorage({
        destination: function (req, file, cb) {
            let destinationDir = `${currentDir}/uploads/`

            if (file.mimetype.startsWith('image/')) {
                destinationDir += 'profiles/'
            } else {
                destinationDir += 'documents/'
            }
            cb(null, destinationDir)
        },
        filename: (req, file, cb) => {
            const fileExtension = path.extname(file.originalname)
            const fileName = file.originalname.split(fileExtension)[0]

            cb(null, `${fileName}-${Date.now()}${fileExtension}`)
        },
    }),

})
// .fields(fields)

module.exports = {
    uploaderUsers,

    // uploaderProducts
}
