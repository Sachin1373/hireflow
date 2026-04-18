import express from 'express'
import cors from 'cors'
import dotenv from 'dotenv'
import 'express-async-errors'
import cookieParser from "cookie-parser";
import authRoutes from '../src/routes/auth.route';
import reviewersRoute from "../src/routes/reviewer.route"

dotenv.config()

const app = express()
const PORT = process.env.PORT || 3001

app.use(cors({ origin: process.env.CLIENT_URL || 'http://localhost:5173', credentials: true }))
app.use(express.json())
app.use(cookieParser());

app.get('/health', (_req, res) => res.json({ status: 'ok' }))


app.use('/api/auth',  authRoutes)
app.use('/api/reviewer', reviewersRoute)

app.use((err: Error, _req: express.Request, res: express.Response, _next: express.NextFunction) => {
  console.error(err)
  res.status(500).json({ error: err.message })
})

app.listen(PORT, () => console.log(`API running on http://localhost:${PORT}`))