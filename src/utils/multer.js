const multer = require('multer')
const path = require ('path')

const { logger } = require('../utils/logger')


const currentDir = path.join(__dirname, '../public')

//Multer de imagen de perfil
const storageProfileImage = multer.diskStorage({
    destination: function (req, file, cb) {
        cb(null, `${currentDir}/uploads/profiles`)
    },
    filename: function (req, file, cb) {
        cb(null, file.originalname)
    },
})

const uploaderProfileImage = multer({
    storageProfileImage,
    onError: function (err, next) {
        logger.error('error en uploader', err)
        next()
    },
})

//Multer de imagen de producto
const storageProductImage = multer.diskStorage({
    destination: function (req, file, cb) {
        cb(null, `${currentDir}/uploads/products`)
    },
    filename: function (req, file, cb) {
        cb(null, file.originalname)
    },
})

const uploaderProductImage = multer({
    storageProductImage,
    onError: function (err, next) {
        logger.error('error en uploader', err)
        next()
    },
})

//Multer de documentos de usuario
const allowedNames = ['identification.txt', 'proofOfAddress.txt', 'statementOfAccount.txt']
const keepAdress =  `${currentDir}/uploads/documents`
const storageUserDocs = multer.diskStorage({
    destination: function (req, file, cb) {
        // cb(null, `${currentDir}/uploads/documents`)
        cb(null, `${currentDir}`)
    },
    filename: function (req, file, cb) {
        const fileExtension = path.extname(file.originalname)
        const fileName = file.originalname.split(fileExtension)[0]
        console.log(keepAdress);
        cb(null, `${fileName}-${Date.now}${fileExtension}`)
    },
    // fileFilter: (req, file, cb) => {
    //     console.log(allowedNames.includes)
    //     console.log(file.originalname);
    //     if(allowedNames.includes(file.originalname)) cb(null, true)
    //      else cb(new Error(`the name ${file.originalname} is not included in allowed names list`))
    // }
})

const uploaderUserDocs = multer ({
    storageUserDocs,
    onError: function (err, next) {
        logger.error('error en uploader', err)
        console.log('error en uploader', err);
        next()
    },

})


module.exports = {
    uploaderProfileImage,
    uploaderProductImage,
    uploaderUserDocs
}
