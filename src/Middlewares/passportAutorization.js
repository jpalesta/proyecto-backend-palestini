const passportAutorization = role => {
    return async (req, res, next)=> {
        console.log('role en authorization',role)
        console.log('req.user en authorization',req.user.user.role)
        if(!req.user.user) return res.status(401).send({status: 'error', error: 'Unauthorized'})
        if(req.user.user.role !== role) return res.status(403).send({status: 'error', error: 'Not permissions'})
        console.log('pasó a next')
        next()
    }
}

module.exports = {
    passportAutorization
}