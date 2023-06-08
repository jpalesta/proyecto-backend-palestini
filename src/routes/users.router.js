const { Router } = require('express')
const {usersModel} = require ('../dao/db/models/user.model')

const router = Router()

router.get('/', async(req,res) =>{
    try {
        let users = await usersModel.find()
        res.send({result: 'succes', payload: users})
    } catch (error){
        console.log('Cannot get users with mongoose'+error)
    }
})

router.post('/', async (req,res)=>{
    let {firstName, lastName, email} =req.body
    if(!firstName || !lastName || !email) return res.send ({status: 'error', message:'You must complete all the fields'})
    let result = await usersModel.create({
        firstName,
        lastName,
        email
    })
    res.send( {status: 'success', payload: result} )
})

module.exports = router
