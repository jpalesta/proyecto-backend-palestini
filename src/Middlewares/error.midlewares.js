const { EErrors } = require("../utils/errors/enums");
const { logger } = require('../utils/logger');

exports.errorHandler = (error, req, res, next) => {
    logger.error('log error mid', error.cause)
    switch (error.code) {
        case EErrors.INVALID_TIPES_ERROR:
            res.send({ status: 'error', error: error.name })
            break;
        default:
            logger.error(error)
            res.send({ status: 'error', error: 'unhandled error'})
    }
}