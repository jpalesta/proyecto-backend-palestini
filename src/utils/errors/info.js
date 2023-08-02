exports.generateUserInfo = (user) => {
    return `One or more properties were incomplete or not valid.
    List of propoerties:
    * fisrtName     : needs to be a String, received ${user.firstName}
    * lastName     : needs to be a String, received ${user.lastName}
    * dateOfBirth  : needs to be a Date, received ${user.dateOfBirth}
    * password     : needs to be a Password, received ${user.password}
    * email           : needs to be an Email, received ${user.email}
    `
}
