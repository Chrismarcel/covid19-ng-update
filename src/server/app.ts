import express from 'express'
import dotenv from 'dotenv'
import compression from 'compression'
import router from './routes'
import http from 'http'
import { sendSSRPage } from './controllers'
import socketInstance from '../config/socket'

dotenv.config()

const app = express()

export const server = http.createServer(app)
const socket = socketInstance.init(server)

socket.on('connect', (socket) => {
  socket.on('disconnect', () => {
    // TODO: Handle socket disconnection
  })
})

app.use(express.urlencoded({ extended: true }))
app.use(express.json())
app.use(compression())

app.get('/', sendSSRPage)
app.use('/', express.static(`${__dirname}/../client`))
app.use('/src', express.static('./src'))
app.use('/api', router)

const PORT = process.env.PORT || 5000

server.listen(PORT, () => console.log(`Listening on Port ${PORT}`))
