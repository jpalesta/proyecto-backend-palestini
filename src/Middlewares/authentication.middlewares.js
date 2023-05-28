function isAuthenticated(req, res, next) {
    if (req.session.user) {
        next()
        return
    }
    res.status(401).send({
        status: 'Error',
        Error: 'Not authenticated'
    })
}

function isAuthenticatedView(req, res, next) {
    if (req.session.user) {
        next()
        return
    }
    res.render('login', {})
}

module.exports = {
    isAuthenticated,
    isAuthenticatedView
}