import express from 'express'
import cors from 'cors'
import helmet from 'helmet'
import morgan from 'morgan'
import cookieParser from 'cookie-parser'
import authRoutes from './routes/auth.routes.js'

const app = express()

app.use(express.json())
app.use(express.urlencoded({ extended: true }))
app.use(cors())
app.use(helmet())
app.use(morgan('dev'))
app.use(cookieParser())

app.get('/health', (req, res) => {
  res.json({ success: true, message: 'Server is running' })
})

app.use('/api', authRoutes)

app.use((req, res) => {
  res.status(404).json({ success: false, message: 'Route not found' })
})

export default app
