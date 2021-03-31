const fs = require("fs");

const loader = require("@assemblyscript/loader");

const readline = require('readline')

// Add WasmModule

let wasmModule = {
    exports: {
        __getString: () => {},
        __newString: () => {}
    }
}

const rl = readline.createInterface({
    input: process.stdin,
    output: process.stdout
})

// Add WAKE Bindings

// WebSocket

const wsImports = require('./imports')

// UDP

//const udpImports = require('as-udp')

const imports = {
    ...eval(wsImports),
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
            
        }
    }
};

wasmModule = loader.instantiateSync(fs.readFileSync(__dirname + "/build/optimized.wasm"), imports);

module.exports = wasmModule.exports;