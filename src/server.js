import express from 'express'
import dotenv from 'dotenv'
import { initDB } from './config/db.js'
import transactionRouter from './routes/transactions.routes.js'

dotenv.config()

const app = express()

//Middleware
app.use(express.json())

const PORT = process.env.PORT || 5001

app.get('/api/health', (req, res) => {
    res.status(200).json({status: 'ok'})
} )

app.use('/api/transactions', transactionRouter)

initDB().then(() => {
    app.listen(PORT, ()=> {
        console.log(`Server running on http://localhost:${PORT}`)
    })
})

