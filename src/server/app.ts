import express from 'express'
import dotenv from 'dotenv'
import bodyParser from 'body-parser'
import compression from 'compression'
import { server } from '../config/socket'
import router from './routes'

dotenv.config()

const app = express()

app.use(bodyParser.urlencoded({ extended: true }))
app.use(bodyParser.json())
app.use(compression())

app.use('/', express.static(`${__dirname}/../client`), router)
app.use('/src', express.static('./src'))

export default app
const PORT = process.env.PORT || 5000

server.listen(PORT, () => console.log(`Listening on Port ${PORT}`))
