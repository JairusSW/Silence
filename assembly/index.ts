declare function promptPointer(prompt: string, callback: i32): void

declare function timeoutPointer(duration: number, callback: i32): void

declare function sendWS(id: number, data: Uint8Array): void
declare function initWS(address: string): number
declare function closeWS(id: number, code: number): void
declare function sendPointer(id: number, event: string, pointer: number): void

import { console } from '../wake/console'

import { asWebSocket } from '../node_modules/as-websocket/assembly/WebSocket'

const socket = new asWebSocket('ws://assemblyscriptsilencedemo4.loca.lt/')

function prompt(prompt: string, callback: (message: string) => void): void {

    promptPointer(prompt, load<i32>(changetype<usize>(callback)))

}

function setTimeout(callback: () => void, duration: number): void {

    timeoutPointer(duration, load<i32>(changetype<usize>(callback)))

}

export let username = 'unknown'

export let toUser = 'unknown'

export function messagePrompt(): void {

    prompt('\n', (message) => {
    
        socket.send(`${toUser}:split:${username}:split:${message}`)
    
    })

}

function send(data: string): void {

    socket.send(data)

}

export function start(): void {

    socket.on('message', (message) => {

        const msg = message.toString().split(':split:')

        const username = msg[0]
        
        const content = msg[1]

        if (username.startsWith(':b')) {

            messagePrompt()

        } else {

            console.log(`\n@${username}: ${content}\n`)

        }

    })

    // Get username

    prompt('\nEnter Your Username: ', (name) => {

        username = name

        send(`:username::split:${username}`)
        // Seemed to fix some problem with closures :P
        
        prompt('\nWho do you want to send to?: ', (use) => {
            
            toUser = use

            setTimeout(() => {
                
                console.log(`\nPreparing connection... [${username}] 🌔   <~~~~🚀~~~~>   🌏 [${toUser}].\n`)

            }, 500);

            setTimeout(() => {
                
                console.log('Connecting Via AssemblyScript Rocket. 🚀\n')

                console.log('Hold on...\n')

            }, 1500);

            setTimeout(() => {
                
                console.log('Linked via AssemblyScript! 🚀\n')

                console.log('Type anywhere to send a message.\n')

                console.log('~~~~~~~~~~~~~~~~~~~\n')

            }, 2700);

            messagePrompt()
        
        })

    })
  
}