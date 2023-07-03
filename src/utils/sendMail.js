const nodemailer = require('nodemailer')
const config     = require('../config/objetConfig')

const transport = nodemailer.createTransport({
    service: 'gmail',
    port: 587,
    auth: {
        user: config.gmail_user_app,
        pass: config.gmail_pass_app
    }
})

exports.sendMail = async (destino, subject, html)=>{
    return await transport.sendMail({
        from: 'Coder Test <projectodigitalgen@gmail.com>',
        // to: 'projectodigitalgen@gmail.com',
        to: destino,
        // subject: 'Correo de prueba comsión 39750',
        subject,
        html,
        // html:`<div>
        //     <h1>Esto es un test</h1>
        // </div>`,
        attachments: [{
            filename:'nodejs.png',
            path: __dirname + '/nodejs.png',
            cid:'nodejs'
        }]
    })
}
