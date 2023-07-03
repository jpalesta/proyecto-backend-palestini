const nodemailer = require('nodemailer')

const transport = nodemailer.createTransport({
    service: 'gmail',
    port: 587,
    auth: {
        user: process.env.GMAIL_USER_APP,
        pass: process.env.GMAIL_PASSWORD_APP
    }
})

exports.sendMail = async (to, subject, amount, tableRows) => {
    return await transport.sendMail({
        from: process.env.GMAIL_USER_APP,
        to: to,
        subject: subject,
        html: `<div>
                    <h1>Ticket generado por un total de $${amount}</h1>
                    <table>
                    <thead>
                        <tr>
                        <th>Descripción</th>
                        <th>Precio</th>
                        <th>Cantidad</th>
                        </tr>
                    </thead>
                    <tbody>
                        ${tableRows}
                    </tbody>
                    </table>
                </div>`,
    })
}
