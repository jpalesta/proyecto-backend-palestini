console.log('chat socket')

const socket = io()

swal.fire({
    title: 'Identificate',
    input: 'text',
    text: 'Ingresá tu nombre de usuario',
    inputValidator: (value) => {
        return !value && 'El nombre de usuario es obligatorio'
    },
    allowOutsideClick: false
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

newMessage.addEventListener('keyup', evt => {
    if (evt.key == 'Enter') {
        if (newMessage.value.trim().length > 0) {
            socket.emit('newMessage', {
                user, message: newMessage.value
            })
            newMessage.value = ''
        }
    }
})

socket.on('completeLogs', data => {
    let messageList = ''
    console.log('clg data recibida de complete logs', data)
    data.forEach(({ user, message }) => {
        messageList += `<li>${user} dice: ${message}</li>`
    })
    messagesList.innerHTML = messageList
})
