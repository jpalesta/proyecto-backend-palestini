const { usersModel } = require("../dao/db/models/user.model")
const { generateToken } = require("../utils/jwt")

class SessionController {
    login = async (req, res) => {
        try {
            const { user } = req
            // @fix ESTA LOGICA DEBE ESTAR EN EL PASSPORT
            // const { email, password } = req.body
            // if (!email || !password) return res.send({ status: 'error', message: 'You must complete all the fields' })
            // const user = await usersModel.findOne({ email })
            if (!user) {
                res.redirect('/register')
                console.log(
                    'The mail provided doesn´t exist, please check the information or register'
                )
            } else {
                const token = generateToken(user)
                res.cookie(process.env.JWT_COOKIE_NAME, token, {
                    maxAge: 60 * 60 * 10000,
                    httpOnly: true,
                })
                res.send({
                    status: 'success',
                    token,
                })
            }
        } catch (error) {
            return console.log(error)
        }
    }

    register = async (req, res) => {
        const { firstName, lastName, email, dateOfBirth } = req.body
            try {
                let user = await usersModel.findOne({ email })
                if (user) {
                    console.log('User already exist')
                    res.redirect('/login')
                }
                const newUser = {
                    firstName,
                    lastName,
                    email,
                    dateOfBirth,
                }
                let result = await usersModel.create(newUser)
                const token = generateToken(result)
                res.send({
                    status: 'success',
                    message: 'User generated ',
                    token
                })
            } catch (error){
            console.log(error)
        }
    }

    current = async (req, res) => {
        let currentUser = req.user
        res.send({
            message: 'Usuario actual',
            currentUser
        })
    }

    logout = async (req, res) => {
        try {
            res.clearCookie(process.env.JWT_COOKIE_NAME)
            console.log('Logout successfull')
            res.redirect('/login')
        } catch (error) {
            console.log(error)
            res.send({ Status: 'error', message: error })
        }
    }

    restorepass = async (req, res) => {
        const { email, password } = req.body
        if (!email || !password) {
            res.status(400).send({
                status: 'error',
                message: 'all the fields must be complete'
            })
        }
        const userDB = await usersModel.findOne({ email })
        if (!userDB) {
            res.status(404).send({
                status: 'error',
                message: 'Username does not exist, please check your login information'
            })
            return
        } else {
            userDB.password = createHash(password)
            await userDB.save()
            res.redirect('/login')
        }
    }

    githubCallback = async (req, res) => {
        try{
            let token = req.user
            console.log(token)
            res.cookie('userCookie', token, {
                maxAge: 60 * 60 * 1000,
                httpOnly: true, 
            })
            res.redirect('/products')
        } catch (error) {
                console.log(error);
                res.redirect('/login')
        }
    }

module.exports = new SessionController