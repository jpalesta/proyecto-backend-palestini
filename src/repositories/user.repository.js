class UsersRepository {
    constructor(dao) {
        this.dao = dao
    }

    get() {
        return this.dao.getUsers()
    }

    create(newUser) {
        return this.dao.createUser(newUser)
    }

}

module.exports = UsersRepository
