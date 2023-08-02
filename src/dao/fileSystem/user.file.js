const { promises } = require('fs')
const fs = promises

class UsersDaoFile {
    constructor() {
        this.users = []
        this.path = './assets/users.json'
    }

    read = async () => {
        try {
            const data = await fs.readFile(this.path, 'utf-8')
            this.users = JSON.parse(data)
            return this.users
        } catch (error) {
            this.users
        }
    }

    write = async () => {
        const users = JSON.stringify(this.users)
        await fs.writeFile(this.path, users)
    }

    getUsers = async () => {
        await this.read()
        return this.users
    }

    getUser = (uid) => {
        this.read()

        let user = this.users.find((prod) => prod.id === pid)
        if (!user) {
            throw 'Product not found'
        } else {
            return user
        }
    }

    createUser = async (newUser) => {
        await this.read()

        let user = this.user.find((user) => user.code === newUser.code)

        if (user) {
            throw 'This product already exist'
        }

        if (this.users.length === 0) {
            this.users.push({ id: 1, ...newUser })
        } else {
            this.users.push({
                id: this.users[this.users.length - 1].id + 1,
                ...newUser,
            })
        }
        await this.write()
    }
}

module.exports = UsersDaoFile
