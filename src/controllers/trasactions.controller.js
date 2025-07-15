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

export async function addTransaction (req, res, next) {
    try {
        const {userId} = req.params //From authmiddleware
        const {name, type, refNumber, amount} = req.body
        
        //Validate input
        if(!name || !type || !refNumber || !amount) {
            return res.status(400).json({message: "Missing required fields"})
        }

        //Parsed the amount 
        const parsedAmount = parseFloat(amount)
        if(isNaN(parsedAmount) || parsedAmount <= 0){
            return res.status(400).json({message: "Invalid amount"})
        }

        //Get user info
        const [user] = await sql `
            SELECT * FROM users WHERE user_id = ${userId}
        `
        if(!user){
            return res.status(404).json({message: "User not found"})
        }

        //Parse the user balance
        let newBalance = parseFloat(user.balance)

        //Update balance based on type
        if(type === 'cashin'){
            newBalance -= parsedAmount
        }
        else if (type === 'cashout') {
            newBalance += parsedAmount
        } else {
            return res.status(400).json({message: "Invalid transaction type"})
        }

        //Update balance in Db
        await sql `
            UPDATE users SET balance = ${newBalance} WHERE user_id = ${userId}
        `
        //Save the transaction
        await sql `
            INSERT into transactions (user_id, name, type, refNumber, amount)
            VALUES( ${userId}, ${name}, ${type}, ${refNumber}, ${amount})
        `
        res.status(201).json({
            message: "Transaction successful",
            balance: newBalance
        })

    } catch (error) {
        next(error)
        console.log(error)
        res.status(500).json({message: "Internal server errro"})
    }
}

