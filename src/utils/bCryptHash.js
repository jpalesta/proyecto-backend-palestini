const bcrypt = require('bcryptjs')

exports.createHash = (password) =>
    bcrypt.hashSync(password, bcrypt.genSaltSync(10))

exports.isValidPassword = (password, user) =>
    bcrypt.compareSync(password, user.password)
