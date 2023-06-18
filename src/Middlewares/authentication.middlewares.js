const { passportAuthentication } = require('./passportAuthentication')

// @fix: LA AUTENTICACION DEBE HACERSE POR PASPORT
// function isAuthenticated(req, res, next) {
//     if (req.session.user) {
//         next()
//         return
//     }
//     res.status(401).send({
//         status: 'Error',
//         Error: 'Not authenticated'
//     })
// }

// function isAuthenticatedView(req, res, next) {
//     if (req.session.user) {
//         next()
//         return
//     }
//     res.render('login', {})
// }

const isAuthenticated = passportAuthentication('jwt', { session: false })

const isAuthenticatedView = passportAuthentication('jwt', {
    session: false,
    failureRedirect: '/login-fail',
})

module.exports = {
    isAuthenticated,
    isAuthenticatedView,
}
