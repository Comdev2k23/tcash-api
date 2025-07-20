import  express from "express";
import { addTransaction, deleteTransactionById, getTransactionByUserId, searchTransactionByRefNumber } from "../controllers/trasactions.controller.js";


const transactionRouter = express.Router()

transactionRouter.get('/search', searchTransactionByRefNumber)

transactionRouter.get('/:userId', getTransactionByUserId)
transactionRouter.post('/new-transaction/:userId',  addTransaction)
transactionRouter.delete('/delete/:id', deleteTransactionById)


export default transactionRouter