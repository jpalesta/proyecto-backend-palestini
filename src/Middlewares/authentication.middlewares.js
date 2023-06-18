const { passportAuthentication } = require('./passportAuthentication')
    
    const isAuthenticated = passportAuthentication()
    
    const isAuthenticatedView = passportAuthentication()
    
    module.exports = {
        isAuthenticated,
        isAuthenticatedView
    }