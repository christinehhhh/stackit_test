import express from 'express'
import notificationRoute from './routes/notificationRoute'

const app = express()

app.use(express.json())

app.use('/api/v1/notification', notificationRoute)

export default app
