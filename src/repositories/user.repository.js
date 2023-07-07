class UsersRepository {
    constructor(dao) {
        this.dao = dao
    }

    get() {
        return this.dao.getUsers()
    }

    getOne(uid) {
        return this.dao.getUser(uid)
    }


    create(newUser) {
        return this.dao.createUser(newUser)
    }

}

module.exports = UsersRepository
