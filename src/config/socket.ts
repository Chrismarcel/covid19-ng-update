import { Server } from 'socket.io'
import http from 'http'

let socketInit: Server

const initSocket = {
  init: (server: http.Server) => {
    socketInit = new Server(server)
    return socketInit
  },
  get: () => {
    if (!socketInit) {
      throw new Error('No socket initialized')
    }
    return socketInit
  },
}

export default initSocket
