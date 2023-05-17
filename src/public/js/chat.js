const socket = io()

swal.fire({
    title: 'Identificate',
    input: 'email',
    text: 'Ingresá tu dirección de mail',
    allowOutsideClick: false,
    inputValidator: (value) => {
        if (!value){'La dirección de correo electrónico es obligatoria'}
        if (!/\S+@\S+\.\S+/.test(value)) {
            return 'La dirección de correo electrónico es inválida'}
        }
}).then(result => {
    user = result.value
    socket.emit('newUserConnected', user)
})

socket.on('newUserConnectedToast', user =>{
    if(!user){
        return 
    }
    Swal.fire({
        toast: true,
        position: 'bottom-right',
        showConfirmButton: false,
        timer: 5000,
        title: `${user} se unió al chat`,
        icon: 'success'
    })
})
const newMessage = document.getElementById('newMessage')
const messagesList = document.getElementById('messagesList')
let user

newMessage.addEventListener('keyup', async evt => {
    if (evt.key == 'Enter') {
        if (newMessage.value.trim().length > 0) {
            socket.emit('newMessage', {
                user, message: newMessage.value
            })
            newMessage.value = ''
        }
    }
})

socket.on('completeLogs', logs => {
    let messageList = ''
    logs.forEach((log) => {
        messageList += `<li>${log.user} dice: ${log.message}</li>`
    })
    messagesList.innerHTML = messageList
})
