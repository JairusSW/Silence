const fs = require("fs");

const loader = require("@assemblyscript/loader");

const readline = require('readline')

// Add WasmModule

let wasmModule

const rl = readline.createInterface({
    input: process.stdin,
    output: process.stdout
})

// Add WAKE Bindings

// WebSocket
let WSsockets = []

const ws = require('ws')

// UDP

let UDPsockets = []

const dgram = require('dgram');

const imports = {
    console: {
        consoleDebug: (message) => {

            console.debug(wasmModule.exports.__getString(message))

        },
        consoleError: (message) => {

            console.error(wasmModule.exports.__getString(message))

        },
        consoleInfo: (message) => {

            console.info(wasmModule.exports.__getString(message))

        },
        consoleTime: (label) => {

            console.time(wasmModule.exports.__getString(label))

        },
        consoleTimeEnd: (label) => {

            console.timeEnd(wasmModule.exports.__getString(label))

        },
        consoleTimeLog: (label) => {

            console.timeLog(wasmModule.exports.__getString(label))

        },
        consoleWarn: (message) => {

            console.warn(wasmModule.exports.__getString(message))

        },
        consoleLog: (message) => {

            console.log(wasmModule.exports.__getString(message))

        }
    },
    index: {
        promptPointer: (prompt, pointer) => {

            const callback = wasmModule.exports.table.get(pointer)

            rl.question(wasmModule.exports.__getString(prompt), (msg) => {

                callback(wasmModule.exports.__newString(msg))

            })
            
        },
        timeoutPointer: (duration, pointer) => {

            const callback = wasmModule.exports.table.get(pointer)

            setTimeout(() => {
                
                callback()

            }, duration);
            
        },
        sendPointer: (id, event, pointer) => {

            if (!WSsockets[id]) return
    
            WSsockets[id]['pointers'][wasmModule.exports.__getString(event).toLowerCase().trim()] = wasmModule.exports.table.get(pointer)
    
        },
        initWS: (address) => {

            WSsockets.push({
                pointers: {
                    message: null,
                    error: null,
                    open: null,
                    connect: null,
                    close: null
                },
                socket: new ws('ws://localhost:3000'),//new ws(wasmModule.exports.__getString(address))
                cache: [],
                ready: false
            })
    
            let id = WSsockets.length - 1
    
            let socket = WSsockets[id]

            socket.socket.on('message', (data) => {

                const messagePtr = wasmModule.exports.__newString(data.toString())
    
                const func = socket.pointers['message']
    
                if (typeof func === 'function') func(messagePtr)
    
            })

            socket.socket.on('open', () => {
            
                const func = socket.pointers['open']
    
                if (typeof func === 'function') func()

                socket.ready = true

                for (const message of socket.cache) {

                    socket.socket.send(message)
                    
                }
    
            })
    
            socket.socket.on('close', () => {
            
                const func = socket.pointers['close']
    
                if (typeof func === 'function') func()
    
            })
    
            socket.socket.on('error', (err) => {
            
                const func = socket.pointers['error']
    
                if (typeof func === 'function') {
                    
                    if (err) return func(__newString(err.message))

                    func()

                }
    
            })
            
            return id
    
        },
        sendWS: (id, message) => {
    
            if (WSsockets[id].ready === false) {
                
                WSsockets[id].cache.push(wasmModule.exports.__getArray(message))

                return
                
            }

            WSsockets[id]['socket'].send(wasmModule.exports.__getArray(message))
    
            return
    
        },
        closeWS: (id, code) => {
    
            WSsockets[id]['socket'].close(code)
    
        }
    }
};

wasmModule = loader.instantiateSync(fs.readFileSync(__dirname + "/build/optimized.wasm"), imports);

module.exports = wasmModule.exports;