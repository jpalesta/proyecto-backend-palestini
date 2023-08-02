const { logger } = require('../utils/logger')

exports.addlogger = (req, res, next) => {
    req.logger = logger
    next()
}
