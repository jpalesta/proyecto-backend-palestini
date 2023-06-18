const passport = require('passport')
const GithubStrategy = require('passport-github2')
const { Strategy, ExtractJwt } = require('passport-jwt')

const { usersModel } = require('../dao/db/models/user.model')
const { createHash, isValidPassword } = require('../utils/bCryptHash')
const { privateKey } = require('./objectConfig')
require('dotenv').config()

//passport GitHub
const initPassportGithub = () => {
    passport.use('github',
        new GithubStrategy({
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

//passport JWT
const JWTStrategy = Strategy
const ExtractJWT = ExtractJwt

let cookieExtractor = (req) => {
    let token = null
    if (req && req.cookies) {
        token = req.cookies['userCookie']
    }
    return token
}

const initPassportJWT = () => {
    passport.use('jwt', new JWTStrategy({
        jwtFromRequest: ExtractJWT.fromExtractors([cookieExtractor]),
        secretOrKey: privateKey
    }, async (jwt_payload, done) => {
        try {
            done(null, jwt_payload)
        } catch (error) {
            return done(error)
        }
    }))
}


module.exports = {
    initPassportGithub,
    initPassportJWT
}