const { Router } = require('express')
import { userModel } from '../models/user.model'

const router = Router()

router.get('/', async(req,res) =>{
    try {
        let users = await userModel.find()
        res.send({result: 'succes', payload: users})
    } catch (error){
        console.log('Cannot get users with mongoose'+error)
    }
})

