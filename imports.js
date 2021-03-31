module.exports = `
    let sockets = []

    const dgram = require('dgram');

    this['UDP'] = {
    UDP: {
        sendPointer: (id, event, pointer) => {

            if (!sockets[id]) return
    
            sockets[id]['pointers'][wasmModule.exports.__getString(event).toLowerCase().trim()] = wasmModule.exports.table.get(pointer)
    
        },
        initUDP: () => {
    
            sockets.push({
                pointers: {
                    message: null,
                    error: null,
                    listening: null,
                    connect: null,
                    close: null
                },
                socket: dgram.createSocket('udp4')
            })
    
            let id = sockets.length - 1
    
            let socket = sockets[id]
    
            socket.socket.on('message', (data, info) => {

                const messagePtr = wasmModule.exports.__newString(data.toString('utf8'))
    
                const func = socket.pointers['message']
    
                if (typeof func === 'function') func(messagePtr)
    
            })
    
            socket.socket.on('listening', () => {
            
                const func = socket.pointers['listening']
    
                if (typeof func === 'function') func()
    
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
    
            socket.socket.on('connect', () => {
            
                const func = socket.pointers['connect']
    
                if (typeof func === 'function') func()
    
            })
            
            return id
    
        },
        sendUDP: (id, message, port, address) => {
    
            sockets[id]['socket'].send(Buffer.from(wasmModule.exports.__getArray(message)), port, wasmModule.exports.__getString(address))
    
            return
    
        },
        closeUDP: (id) => {
    
            sockets[id]['socket'].close()
    
        },
        bindUDP: (id, port, address) => {
    
            sockets[id]['socket'].bind(port, wasmModule.exports.__getString(address))
    
        }
    }
}`