const {usersService} = require('../service')


class UserControler {

    getAll = async(req,res) =>{
        try {
            let users = await usersService.find()
            res.send({result: 'succes', payload: users})
        } catch (error){
            console.log('Cannot get users with mongoose'+error)
        }
    }

    create = async (req,res)=>{
        let {firstName, lastName, email} =req.body
        if(!firstName || !lastName || !email) return res.send ({status: 'error', message:'You must complete all the fields'})
        let result = await usersService.create({
            firstName,
            lastName,
            email
        })
        res.send( {status: 'success', payload: result} )
    }
}

module.exports = new UserControler