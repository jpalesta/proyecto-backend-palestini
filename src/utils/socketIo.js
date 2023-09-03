const chatManagerDB = require('../dao/db/chatManagerDB')
const  {logger}  = require('../utils/logger')

function socketIoSetup(io) {
    io.on('connection', (socket) => {
        logger.info('new client connect')
        
        socket.on('productsUpdated', (data) => {
            console.log('llego el emit de prod', data);
            prods = data
            io.emit('updatedProductsUi', prods)
            logger.info('productos enviados a realtime')
        });
        
        socket.on('newUserConnected', async (data) => {
            socket.broadcast.emit('newUserConnectedToast', data)
            logs = await chatManagerDB.getmessages()
            io.emit('completeLogs', logs)
        });
        
        socket.on('newMessage', async (newMessage) => {
            await chatManagerDB.addMessage(newMessage)
            logs = await chatManagerDB.getmessages()
            io.emit('completeLogs', logs)
        });
    });
}

module.exports = { socketIoSetup }