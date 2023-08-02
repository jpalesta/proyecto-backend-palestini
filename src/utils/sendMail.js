const nodemailer = require('nodemailer')

const transport = nodemailer.createTransport({
    service: 'gmail',
    port: 587,
    auth: {
        user: process.env.GMAIL_USER_APP,
        pass: process.env.GMAIL_PASSWORD_APP,
    },
})

exports.sendMail = async (to, subject, html) => {
    return await transport.sendMail({
        from: process.env.GMAIL_USER_APP,
        to: to,
        subject: subject,
        html: html,
    })
}
