const path = require('path')
const mongoose = require('mongoose')

const { usersService, cartsService } = require('../service')
const { logger } = require('../utils/logger')
const { EErrors } = require('../utils/errors/enums')
const { generateUserInfo } = require('../utils/errors/info')
const { CustomError } = require('../utils/errors/CustomError')
const { createHash } = require('../utils/bCryptHash')
const UserDto = require('../dto/user.dto')
const { response } = require('express')

class UserControler {
    getAll = async (req, res) => {
        try {
            let users = await usersService.get()
            let usersDto = users.map((user) => new UserDto(user))
            res.send({ result: 'success', payload: usersDto })
        } catch (error) {
            logger.error('Cannot get users with mongoose' + error)
        }
    }

    create = async (req, res, next) => {
        try {
            let { firstName, lastName, email, dateOfBirth, password, role } =
                req.body
            if (
                !firstName ||
                !lastName ||
                !email ||
                !dateOfBirth ||
                !password
            ) {
                CustomError.createError({
                    name: 'User Creation Error',
                    cause: generateUserInfo({
                        firstName,
                        lastName,
                        email,
                        dateOfBirth,
                        password,
                    }),
                    message: 'Error trying to create User',
                    code: EErrors.INVALID_TIPES_ERROR,
                })
            } else {
                const cart = await cartsService.createCart({ products: [] })
                const passwordHashed = createHash(password)
                let result = await usersService.create({
                    firstName,
                    lastName,
                    email,
                    password: passwordHashed,
                    dateOfBirth,
                    cart: { id: cart._id },
                    role,
                })
                res.send({ status: 'success', payload: result })
            }
        } catch (error) {
            next(error)
        }
    }

    userDocsUpload = async (req, res) => {
        try {
            const uid = req.params.uid
            if (!mongoose.Types.ObjectId.isValid(uid)) {
                return res.status(400).send({
                    status: 'error',
                    message: 'Invalid user ID format',
                })
            }
            const userToUpdate = await usersService.getUser({ _id: uid })
            if (!userToUpdate) {
                return res.status(400).send({
                    status: 'error',
                    message:
                        'The user doesn´t exist, please check your information',
                })
            } else {
                for (const uploadedDocType in req.files) {
                    if (uploadedDocType === 'profileImage') {
                        if (userToUpdate.profileImage) {
                            userToUpdate.profileImage.name =
                                req.files[uploadedDocType][0].filename
                            userToUpdate.profileImage.reference =
                                req.files[uploadedDocType][0].path
                        } else {
                            userToUpdate.profileImage = {
                                name: req.files[uploadedDocType][0].name,
                                reference: req.files[uploadedDocType][0].path,
                            }
                        }
                    } else {
                        const existingDocIndex =
                            userToUpdate.documents.findIndex(
                                (doc) => doc.type === uploadedDocType
                            )
                        if (existingDocIndex !== -1) {
                            userToUpdate.documents[existingDocIndex].name =
                                req.files[uploadedDocType][0].filename
                            userToUpdate.documents[existingDocIndex].reference =
                                req.files[uploadedDocType][0].path
                        } else {
                            userToUpdate.documents.push({
                                name: req.files[uploadedDocType][0].filename,
                                reference: req.files[uploadedDocType][0].path,
                                type: uploadedDocType,
                            })
                        }
                    }
                }
                await userToUpdate.save()
                res.status(200).send({
                    status: 'success',
                    message: 'User documents loaded ok',
                })
            }
        } catch (error) {
            logger.error(error)
        }
    }

    roleChange = async (req, res, next) => {
        try {
            const uid = req.params.uid
            if (!mongoose.Types.ObjectId.isValid(uid)) {
                return res.status(400).send({
                    status: 'error',
                    message: 'Invalid user ID format',
                })
            }
            const currentUser = await usersService.getUser({ _id: uid })
            const currentUserRole = currentUser.role
            if (!currentUserRole) {
                logger.error('Cannot get user with mongoose')
                return res.status(400).send({
                    status: 'error',
                    message: 'User not found in Data Base',
                })
            }
            if (currentUserRole === 'user') {
                if (currentUser.documents[2]) {
                    currentUser.role = 'premium'
                    await currentUser.save()
                    return res.status(200).send({
                        status: 'success',
                        message: 'The user role was changed to Premium',
                    })
                } else {
                    return res.status(400).send({
                        status: 'error',
                        message:
                            'The user doesn´t have all the documents to upgrade to premium profile, please send all the required documentation',
                    })
                }
            } else if (currentUserRole === 'premium') {
                currentUser.role = 'user'
                await currentUser.save()
                return res.status(200).send({
                    status: 'success',
                    message: 'The user role was changed to User',
                })
            } else {
                logger.error('The user role was not changed')
                return res.status(400).send({
                    status: 'error',
                    message: 'The user role was not changed',
                })
            }
        } catch (error) {
            return res.status(400).send({
                status: 'error',
                message: error.message,
            })
        }
    }

    deleteInactiveUsers = async (req, res) => {
        try {
            let users = await usersService.get()
            let usersDeleted = []

            for (let user of users) {
                let inactiveTime = Date.now() - user.lastConnection
                if (inactiveTime > 1000 * 60 * 60 * 24 * 2) {
                    await usersService.delete(user._id)
                    usersDeleted.push(user.email)
                }
            }
            if (usersDeleted.length === 0) {
                res.status(201).send({
                    status: 'success',
                })
            } else {
                res.status(200).send({
                    status: 'success',
                    body: usersDeleted,
                })
                console.log('borró + de 1')
            }
        } catch (error) {
            console.error('Error al eliminar usuarios inactivos', error)
            res.status(500).json({ error: 'Internal error' })
        }
    }

    deleteUser = async (req, res) => {
        try {
            const uid = req.params.uid
            if (!mongoose.Types.ObjectId.isValid(uid)) {
                return res.status(400).send({
                    status: 'error',
                    message: 'Invalid user ID format',
                })
            }
            const userToDelete = await usersService.delete(uid)
            if (userToDelete.deletedCount === 0) {
                res.status(400).send({
                    status: 'error',
                    message: `User ${uid} not found in Data Base`,
                })
            } else {
                res.status(200).send({
                    status: 'succes',
                    message: `User deleted for the Data Base`,
                })
            }
        } catch (error) {
            return res.status(400).send({
                status: 'error',
                message: error.message,
            })
        }
    }
}

module.exports = new UserControler()
