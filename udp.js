const dgram = require('dgram')

let clients = new Map()

const socket = dgram.createSocket('udp4')

socket.bind(3000)

socket.on('message', (message, info) => {

    console.log('Got Message: ', message.toString())

    message = message.toString().split(':split:')

    // Disconnect
    if (message[0] === ':disconnect:') {

        clients.delete(message[1])

        return

    }

    // Register
    if (message[0] === ':username:') {

        clients.set(message[1], {
            port: info.port,
            address: info.address
        })

        return

    }

    const toUsername = message[0]

    const fromUsername = message[1]

    const content = message[2]

    socket.send(':back::split:', info.port, info.address)
    
    if (!clients.has(toUsername)) {
        
        socket.send(`Admin:split:Couldn't find the user. Are they linked?`)

        return

    }

    const to = clients.get(toUsername)

    socket.send(`${fromUsername}:split:${content}`, to.port, to.address)

})