const passport = require('passport')
const passportLocal = require('passport-local')
const GithubStrategy = require('passport-github2')
const { usersModel } = require('../dao/db/models/user.model')
const { createHash, isValidPassword } = require('../utils/bCryptHash')
require('dotenv').config()

// const LocalStrategy = passportLocal.Strategy

// const initPassportMid = () => {
//     passport.use('register', new LocalStrategy({

//     }, async () =>{}))
// }
// passport.use('login', new LocalStrategy({}, async () =>{}))

const initPassportGithub = () => {
    passport.use('github', new GithubStrategy({
        clientID: process.env.GITHUB_CLIENT_ID,
        clientSecret: process.env.GITHUB_CLIENT_SECRET,
        callbackURL: process.env.GITHUB_CALLBACK_URL
    }, async (accessToken, refreshToken, profile, done) => {
        console.log('profile', profile)

        try {
            user = await usersModel.findOne({ email: profile._json.email })
            if (!user) {
                let newUser = {
                    firstName: profile.username,
                    lastName: '',
                    email: profile._json.email,
                    password: '',
                    role: 'user'
                }
                let result = await usersModel.create(newUser)
                return done(null, result)
            }
            return done(null, user)
        } catch (error) {
            console.log(error)
        }
    }))
    passport.serializeUser((user, done) => {
        done(null, user._id)
    })
    passport.deserializeUser(async (id, done) => {
        let user = await usersModel.findOne({ _id: id })
        done(null, user)
    })
}

module.exports = {
    // initPassportMid,
    initPassportGithub
}