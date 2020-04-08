import express from 'express'
import dotenv from 'dotenv'
import bodyParser from 'body-parser'
import http from 'http'
import io from 'socket.io'
import handleSSR from './ssr'

dotenv.config()

const app = express()
const server = http.createServer(app)
const socket = io(server)

socket.on('connect', (socket) => {
  socket.on('disconnect', () => {
    // TODO: Handle socket disconnection
  })
})

app.get('/', (req, res) => {
  res.send(handleSSR(req, res))
})

app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());

app.use('/', express.static(`${__dirname}/../client`))
app.use('/src', express.static('./src'))


app.post('/update', (req, res) => {
  const { cases } = req.body
  socket.emit('updated cases', { message: cases })
  return res.json()
})

const PORT = process.env.PORT || 5000

server.listen(PORT, () => console.log(`Listening on Port ${PORT}`))
