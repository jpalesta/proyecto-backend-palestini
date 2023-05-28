const passport = require('passport')
const passportLocal = require('passport-local')
const { usersModel } = require('../dao/db/models/user.model')
const { createHash, isValidPassword } = require('../utils/bCryptHash')

const LocalStrategy = passportLocal.Strategy

const initPassportMid = () => {
    passport.use('register', new LocalStrategy({

    }, async () =>{}))
}
passport.use('login', new LocalStrategy({}, async () =>{}))

module.exports = {
    initPassportMid
}