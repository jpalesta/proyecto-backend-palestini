const passport = require('passport')
const passportLocal = require('passport-local')
const GithubStrategy = require('passport-github2')
const { Strategy, ExtractJwt } = require('passport-jwt')
const jwt = require('jsonwebtoken')

const { usersService, cartsService } = require('../service')
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
                let user = await usersService.getOne({ email: username })
                if (user) {
                    throw new Error('User already exists')
                    //lo comenté porque no funciona después del throw
                    // return (done, false)
                }
                const cart = await cartsService.createCart({products:[]})
                const newUser = {
                    firstName,
                    lastName,
                    email,
                    dateOfBirth,
                    password: createHash(password),
                    cart: { id: cart._id }
                }
                let result = await usersService.create(newUser)
                return done(null, result)
            } catch (error) {
                return done('Error al obtener el usuario' + error)
            }
        }))

    passport.serializeUser((user, done) => {
        done(null, user._id)
    })
    passport.deserializeUser(async (id, done) => {
        let user = await usersService.getOne({ _id: id })
        done(null, user)
    })

    passport.use('login', new LocalStrategy({ usernameField: 'email' }, async (username, password, done) => {
        try {
            //aca va el condicional para el admin
            if (username === process.env.ADMIN_EMAIL && password === process.env.ADMIN_PASSWORD) {
                const user = await usersService.getOne({ email: username })
                user.role = 'admin'
                return done(null, user)
            }
            const user = await usersService.getOne({ email: username })
            if (!user) {
                console.log('User doesn´t exist')
                return done(null, false)
            }
            if (!isValidPassword(password, user)) return done(null, false);
            return done(null, user)
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
        callbackURL: process.env.GITHUB_CALLBACK_URL,
    }, async (accessToken, refreshToken, profile, done) => {
        try {
            // console.log('profile', profile)
            let user = await usersService.getOne({ email: profile._json.email })
            // console.log('userenpassportgithub', user)
            if (!user) {
                let newUser = {
                    firstName: profile.username,
                    lastName: '',
                    email: profile._json.email,
                    password: '',
                    role: 'user'
                }
                let result = await usersService.create(newUser)
                return done(null, result)
            }
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