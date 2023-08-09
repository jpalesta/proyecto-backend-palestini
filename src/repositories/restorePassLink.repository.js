class ResorePassLinkRepository {
    constructor(dao) {
        this.dao = dao
    }

    createRestorePassLink(email) {
        return this.dao.createRestorePassLink(email)
    }

    getOne(link) {
        return this.dao.getOne(link)
    }

    delete(link) {
        return this.dao.delete(link)
    }
}

module.exports = ResorePassLinkRepository
