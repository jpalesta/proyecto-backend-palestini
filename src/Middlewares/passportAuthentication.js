const passport = require('passport')

const passportAuthentication = (strategy) => {
    return async (req, res, next) => {

        passport.authenticate(strategy,{session:false}, function(err, user, info) {
            if(err) return next(err)
            if(!user) {
                return res.status(401).send({ status: 'error', error: info.message ? info.message : info.toString() })
            }
            req.user = user
            next()
        })(req, res, next)
    }
}

module.exports = {
    passportAuthentication
}