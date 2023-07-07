const { EErrors } = require("../utils/errors/enums");

exports.errorHandler = (error, req, res, next) => {
    console.log('log error mid', error.cause)
    switch (error.code) {
        case EErrors.INVALID_TIPES_ERROR:
            res.send({ status: 'error', error: error.name })
            break;
        default:
            console.log(error)
            res.send({ status: 'error', error: 'unhandled error'})
    }
}