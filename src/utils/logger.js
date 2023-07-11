const winston = require ('winston')

const CustomLevelsOptions = {
    levels: {
        fatal: 0,
        error: 1,
        warning: 2,
        http: 3,
        info: 4,
        debug: 5
    },
    colors: {
        fatal: 'red',
        error: 'orange',
        warning: 'yellow',
        http: 'blue',
        info: 'white',
        debug: 'green'
    }
}

const logger = winston.createLogger({
    levels: CustomLevelsOptions.levels,
    transports: [
        new winston.transports.Console({ 
            level: 'http',
            format: winston.format.combine(
                winston.format.colorize({colors: CustomLevelsOptions.colors}),
                winston.format.simple()
                )
        }),
        new winston.transports.File({ 
            filename: './errors.log', 
            level: 'warning', 
            format: winston.format.simple() 
        })
    ]
})

module.exports = {
    logger
}