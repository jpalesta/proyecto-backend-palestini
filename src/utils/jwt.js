const jwt = require('jsonwebtoken')
const { privateKey } = require('../config/objectConfig')

const generateToken = (user) => {
    const token = jwt.sign({ user }, privateKey, { expiresIn: '1d' })
    return token
}

module.exports = {
    generateToken    
}