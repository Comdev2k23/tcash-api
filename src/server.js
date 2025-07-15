import express from 'express'
import dotenv from 'dotenv'
import { initDB } from './config/db.js'
import transactionRouter from './routes/transactions.routes.js'
import userRouter from './routes/users.routes.js'
import job from './config/cron.js'
import rateLimiter from './middlewares/rateLimiter.js'

dotenv.config()

const app = express()
if (process.env.NODE_ENV === "production") job.start();

//Middleware
app.use(express.json())
app.use(rateLimiter);

const PORT = process.env.PORT || 5001

app.get('/api/health', (req, res) => {
    res.status(200).json({status: 'ok'})
} )

app.use('/api/transactions', transactionRouter)
app.use('/api/users', userRouter)

initDB().then(() => {
    app.listen(PORT, ()=> {
        console.log(`Server running on http://localhost:${PORT} 🚀`)
    })
})

