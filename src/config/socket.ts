import http from 'http'
import { Server } from 'socket.io'
import app from '../server/app'

const server = http.createServer(app)
const socket = new Server(server)

socket.on('connect', (socket) => {
  socket.on('disconnect', () => {
    // TODO: Handle socket disconnection
  })
})

export { server, socket }
