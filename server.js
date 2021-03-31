const WebSocket = require('ws')

const server = new WebSocket.Server({
    port: 3000
})

let clients = new Map()

server.on('connection', (client) => {

    client.on('message', (message) => {

        console.log('Got Message: ', message.toString())

        message = message.toString().split(':split:')

        // Disconnect
        if (message[0] === ':disconnect:') {

            clients.get(message[1]).terminate()

            clients.delete(message[1])

            return

        }

        // Register
        if (message[0] === ':username:') {

            clients.set(message[1], client)

            return

        }

        const toUsername = message[0]

        const fromUsername = message[1]

        const content = message[2]

        client.send(':back::split:')
        
        if (!clients.has(toUsername)) {
            
            client.send(`Admin:split:Couldn't find the user. Are they linked?`)

            return

        }

        clients.get(toUsername).send(`${fromUsername}:split:${content}`)

    })

})