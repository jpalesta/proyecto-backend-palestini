const { usersModel } = require("../dao/db/models/user.model")
const { generateToken } = require("../utils/jwt")

class SessionController {

    login = async (req, res) => {
        try {
            const { email, password } = req.body
            if (!email || !password) return res.send({ status: 'error', message: 'You must complete all the fields' })
            const user = await usersModel.findOne({ email })
            if (!user) {
                res.redirect('/register')
                console.log('The mail provided doesn´t exist, please check the information or register')
            } else {
                const token = generateToken(user)
                res.cookie('userCookie', token, {
                    maxAge: 60 * 60 * 10000,
                    httpOnly: true
                })
                res.send({
                    status: 'success',
                    token
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
}

module.exports = new SessionController