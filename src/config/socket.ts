import { Server } from 'socket.io'
import http from 'http'

let socketServer: Server

const socketConfig = {
  init: (server: http.Server) => {
    socketServer = new Server(server)
    return socketServer
  },
  get: () => {
    if (!socketServer) {
      throw new Error('No socket server initialized')
    }
    return socketServer
  },
}

export default socketConfig
