const { logger } = require ('../utils/logger')

exports.addlogger = ( req, res, next) => {
    req.logger = logger
    logger.http(`${req.method} en ${req.url} - ${new Date().toLocaleString()}`)
    next()
}