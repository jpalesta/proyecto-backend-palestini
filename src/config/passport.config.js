const passport = require('passport')
const passportLocal = require('passport-local')
const GithubStrategy = require('passport-github2')
const { Strategy, ExtractJwt } = require('passport-jwt')
const jwt = require('jsonwebtoken')

const { usersModel } = require('../dao/db/models/user.model')
const { createHash, isValidPassword } = require('../utils/bCryptHash')
const { privateKey } = require('./objectConfig')
require('dotenv').config()

//passport Local
const LocalStrategy = passportLocal.Strategy
const initPassportLocal = () => {
    passport.use('register', new LocalStrategy(
        { passReqToCallback: true, usernameField: 'email' }, async (req, username, password, done) => {
            const { firstName, lastName, email, dateOfBirth } = req.body
            try {
                let user = await usersModel.findOne({ email: username })
                if (user) {
                    console.log('User already exist')
                    return (done, false)
                }
                const newUser = {
                    firstName,
                    lastName,
                    email,
                    dateOfBirth,
                    password: createHash(password)
                }
                let result = await usersModel.create(newUser)
                return done(null, result)
            } catch (error) {
                return done('Error al obtener el usuario' + error)
            }
        }))
    passport.serializeUser((user, done) => {
        done(null, user._id)
    })
    passport.deserializeUser(async (id, done) => {
        let user = await usersModel.findOne({ _id: id })
        done(null, user)
    })

    passport.use('login', new LocalStrategy({ usernameField: 'email' }, async (username, password, done) => {
        try {
            const user = await usersModel.findOne({ email: username })
            if (!user) {
                console.log('User doesn´t exist')
                return done(null, false)
            }
            if (!isValidPassword(password, user)) {
                console.log('pass erroneo')
                return done(null, false)
            } else {
                console.log('el pass esta ok')
                return done(null, user)
            }
        } catch (error) {
            return done(error)
        }
    }))
}

//passport GitHub
const initPassportGithub = () => {
    passport.use('github', new GithubStrategy({
        clientID: process.env.GITHUB_CLIENT_ID,
        clientSecret: process.env.GITHUB_CLIENT_SECRET,
        callbackURL: process.env.GITHUB_CALLBACK_URL
    }, async (accessToken, refreshToken, profile, done) => {

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
                user = result
            }
            // Guarda la información del usuario en una cookie
            const userData = {
                _id: user._id,
                email: user.email,
                role: user.role
            }
            const token = jwt.sign(userData, privateKey)

            res.cookie(process.env.JWT_COOKIE_NAME, token, {
                httpOnly: true,
                secure: true,
                maxAge: 7 * 24 * 60 * 60 * 1000 // Tiempo de expiración de la cookie en milisegundos
            })
            return done(null, user)
        } catch (error) {
            console.log(error)
        }
    }))
}

//passport JWT
const JWTStrategy = Strategy
const ExtractJWT = ExtractJwt

let cookieExtractor = (req) => {
    let token = null
    if (req && req.cookies) {
        token = req.cookies[process.env.JWT_COOKIE_NAME]
    }
    return token
}

const initPassportJWT = () => {
    passport.use(
        'jwt',
        new JWTStrategy(
            {
                jwtFromRequest: ExtractJWT.fromExtractors([cookieExtractor]),
                secretOrKey: privateKey,
            },
            async (jwt_payload, done) => {
                try {
                    done(null, jwt_payload)
                } catch (error) {
                    return done(error)
                }
            }
        )
    )
}

module.exports = {
    initPassportLocal,
    initPassportGithub,
    initPassportJWT
}