const { passportAuthentication } = require("./passportAuthentication")

const isAuthenticated = passportAuthentication ()

const isAuthenticatedView = passportAuthentication ({ failureRedirect: '/login-fail'})

module.exports = {
    isAuthenticated,
    isAuthenticatedView
}