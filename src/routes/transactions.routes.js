import  express from "express";
import { addTransaction, getTransactionByUserId } from "../controllers/trasactions.controller.js";
import { authMiddleware, validateUserExists } from "../middlewares/auth.middleware.js";

const transactionRouter = express.Router()

transactionRouter.get('/:userId', getTransactionByUserId)
transactionRouter.post('/new-transaction/:userId',  addTransaction)

export default transactionRouter