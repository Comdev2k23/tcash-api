import { sql } from "../config/db.js";

export async function getTransactionByUserId (req, res, next) {
    try {
        const {userId} = req.params

        const transactions = await sql`
            SELECT * FROM transactions WHERE user_id = ${userId} ORDER BY created_at DESC 
        `
        if(transactions.length === 0){
            return res.status(404).json({message: 'Transaction/s not found'})
        }

        res.status(200).json(transactions)

    } catch (error) {
        console.log('Error: error get transaction', error)
        next(error)
    }
}