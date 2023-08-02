const { passportAuthentication } = require('./passportAuthentication')

const isAuthenticated = passportAuthentication('jwt', { session: false })

const isAuthenticatedView = passportAuthentication('jwt', {
    session: false,
    failureRedirect: '/login-fail',
})

module.exports = {
    isAuthenticated,
    isAuthenticatedView,
}
