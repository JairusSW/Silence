// JS Imports
declare function sendUDP(id: number, data: Uint8Array, port: number, address: string): void
declare function initUDP(type: number): number
declare function closeUDP(id: number): void
declare function bindUDP(id: number, port: number, address: string): void
declare function sendPointer(id: number, event: string, pointer: number): void
// Miscellanious

// API
export class UDPSocket {

  // Support multiple sockets. (based on id)
  private id: number = 0

  constructor(type: string) {

    let id = initUDP(parseInt(type.replace('udp', '')))

    this.id = id

  }

  sendBinary(data: Uint8Array, port: number, address: string): void {

    sendUDP(this.id, data, port, address)

  }
  send(data: string, port: number, address: string): void {

    sendUDP(this.id, Uint8Array.wrap(String.UTF8.encode(data)), port, address)

  }
  close(): void {

    closeUDP(this.id)
    // Need to delete from the socket list without messing it up

  }
  bind(port: number, address: string): void {

    bindUDP(this.id, port, address)

  }

  on(event: string, callback: (data: string) => void): void {
    // It works!
    sendPointer(this.id, event, load<i32>(changetype<usize>(callback)))
    // NOTE: Does not call every time! Only calls if once.
  }
  
}

// Socket Testing

export function test(): boolean {

  const socket = new UDPSocket('udp4')

  socket.on('message', (data) => {

  })

  socket.on('listening', () => {
    
  })

  socket.send('Hello From AssemblyScript!', 3000, 'localhost')
  
  return true
  
}