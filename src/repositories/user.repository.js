class UsersRepository {
    constructor(dao) {
        this.dao = dao
    }

    get() {
        return this.dao.getUsers()
    }

    getUser(uid) {
        return this.dao.getUser(uid)
    }

    create(newUser) {
        return this.dao.createUser(newUser)
    }

    delete(email) {
        return this.dao.deleteUser(email)
    }
}

module.exports = UsersRepository
