const winston = require('winston')

const config = require('../config/objectConfig')

const CustomLevelsOptions = {
    levels: {
        fatal: 0,
        error: 1,
        warning: 2,
        info: 3,
        http: 4,
        debug: 5
    },
    colors: {
        fatal: 'red',
        error: 'magenta',
        warning: 'yellow',
        info: 'blue',
        http: 'white',
        debug: 'green'
    }
}

let logger

if (config.mode === 'development') {
    console.log('entró a dev')
    logger = winston.createLogger({
        levels: CustomLevelsOptions.levels,
        transports: [
            new winston.transports.Console({
                level: config.loggerLevelConsole,
                format: winston.format.combine(
                    winston.format.colorize({ colors: CustomLevelsOptions.colors }),
                    winston.format.simple()
                )
            })
        ]
    })
} else {
    console.log('entró a prod')
    console.log('config console', config.loggerLevelConsole)
    console.log('config file', config.loggerLevelFile)
    logger = winston.createLogger({
        levels: CustomLevelsOptions.levels,
        transports: [
            new winston.transports.Console({
                level: config.loggerLevelConsole,
                format: winston.format.combine(
                    winston.format.colorize({ colors: CustomLevelsOptions.colors }),
                    winston.format.simple()
                )
            }),
            new winston.transports.File({
                filename: './errors.log',
                level: console.loggerLevelFile,
                format: winston.format.simple()
            })
        ]
    })
}


module.exports = {
    logger
}