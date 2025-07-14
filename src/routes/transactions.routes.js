import  express from "express";
import { getTransactionByUserId } from "../controllers/trasactions.controller.js";

const transactionRouter = express.Router()

transactionRouter.get('/:userId', getTransactionByUserId)

export default transactionRouter