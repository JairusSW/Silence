// JS Imports
declare function sendWS(id: number, data: Uint8Array): void
declare function initWS(address: string): number
declare function closeWS(id: number, code: number): void
declare function sendPointer(id: number, event: string, pointer: number): void
// Miscellanious

// API
export class WebSocket {

  // Support multiple sockets. (based on id)
  private id: number = 0

  constructor(address: string) {

    let id = initWS(address)

    this.id = id

  }

  sendBinary(data: Uint8Array): void {

    sendWS(this.id, data)

  }
  send(data: string): void {

    sendWS(this.id, Uint8Array.wrap(String.UTF8.encode(data)))

  }
  close(code: number): void {

    closeWS(this.id, code)
    // Need to delete from the socket list without messing it up
  }
  on(event: string, callback: (data: string) => void): void {
    // It works!
    sendPointer(this.id, event, load<i32>(changetype<usize>(callback)))
    // NOTE: Does not call every time! Only calls if once.
  }
  
}