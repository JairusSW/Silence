const readline = require('readline')

let username = 'unknown'

let toUser = ''

const rl = readline.createInterface({
    input: process.stdin,
    output: process.stdout
})

const WebSocket = require('ws')

const socket = new WebSocket('ws://localhost:3000')

socket.on('message', (message, info) => {

    const msg = message.toString().split(':split:')

    const username = msg[0]

    if (username === ':back:') {

        messagePrompt()

        return
        
    }

    const content = msg[1]

    console.log(`@${username}: ${content}`)

})

function messagePrompt() {

    rl.question('', (message) => {
    
        socket.send(`${toUser}:split:${username}:split:${message}`)
        
    })

}

// Get username

rl.question('Enter Your Username: ', (name) => {

    username = name

    socket.send(`:username::split:${username}`)

    rl.question('Who do you want to send to?: ', (use) => {
        
        toUser = use

        setTimeout(() => {
            
            console.log(`Preparing connection... [${username}] 🌔   <~~~~🚀~~~~>   🌏 [${toUser}].\n`)

        }, 500);

        setTimeout(() => {
            
            console.log('Connecting Via AssemblyScript Rocket. 🚀\n')

            console.log('Hold on...\n')

        }, 1500);

        setTimeout(() => {
            
            console.log('Linked via AssemblyScript! 🚀\n')

            console.log('Type anywhere to send a message.\n')

        }, 2700);

        messagePrompt()
    
    })

})