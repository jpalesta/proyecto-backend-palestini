const passportAutorization = role => {
    return async (req, res, next)=> {
        if(!req.user.user) return res.status(401).send({status: 'error', error: 'Unauthorized'})
        if(req.user.user.role !== role) return res.status(403).send({status: 'error', error: 'Not permissions'})
        next()
    }
}

module.exports = {
    passportAutorization
}