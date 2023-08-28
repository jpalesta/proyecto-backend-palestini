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
    
    updateById(uid, dateConnection) {
        return this.dao.updateUser(uid, dateConnection)
    }
    
    delete(uid) {
        return this.dao.deleteUser(uid)
    }
}

module.exports = UsersRepository
