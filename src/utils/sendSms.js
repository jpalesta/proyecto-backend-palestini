const twilio = require('twilio')

const twilio_sid = process.env.TWILIO_ACOUNT_SID
const twilio_auth_token = process.env.TWILIO_AUTH_TOKEN
const twilio_phone_number = process.env.TWILIO_SMS_NUMBER
const twilio_my_phone_number = process.env.TWILIO_MY_PHONE_NUMBER

const cliente = twilio(twilio_sid, twilio_auth_token)

exports.sendSms = (firstName, lastName) => cliente.messages.create({
    body: `Gracias por tu compra ${firstName} ${lastName}`,
    from: twilio_phone_number,
    to: twilio_my_phone_number
})


