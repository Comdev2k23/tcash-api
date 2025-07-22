import { sql } from "../config/db.js";

export async function getTransactionByUserId (req, res, next) {
    try {
        const {userId} = req.params

        const transactions = await sql`
            SELECT * FROM transactions WHERE user_id = ${userId}
            ORDER BY created_at DESC 
        `
       
        res.status(200).json(transactions)

    } catch (error) {
        console.log('Error: error get transaction', error)
        next(error)
    }
}

export async function addTransaction (req, res, next) {
    try {
        const {userId} = req.params 
        const {type, refNumber, amount} = req.body
    
        //Validate input
        if( !type || !refNumber || !amount) {
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
        //Check for existing refNumber
        const existing = await sql`
            SELECT FROM transactions WHERE refNumber =${refNumber} LIMIT 1
        `
        if(existing.length > 0){
            return res.status(409).json({
                message: "Transaction with this refenrence number already exists    "})
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
            INSERT INTO transactions (user_id,type, refNumber, amount)
            VALUES( ${userId}, ${type}, ${refNumber}, ${amount})
        `
        res.status(201).json({
            message: "Transaction successful",
            balance: newBalance
        })

    } catch (error) {
        console.log('Error: Internal Server Error', error)
        next(error)
    }
}
export async function searchTransactionByRefNumber(req, res, next) {
    try {
        const { refNumber } = req.query;

        // Validate refNumber if exists
        if (!refNumber) {
            return res.status(400).json({ message: "Reference number is required" }); // Changed to 400
        }

        // Search transactions with this ref number
        const transactions = await sql`
            SELECT * FROM transactions WHERE refNumber = ${refNumber}
            ORDER BY created_at DESC
        `;

        if (transactions.length === 0) {
            return res.status(404).json({ message: "No transactions found with this reference number" });
        }

        res.status(200).json({
            count: transactions.length,
            transactions
        });

    } catch (error) {
        console.error('Error searching transactions:', error); // Changed to error
        next(error);
    }
}
export async function deleteTransactionById (req, res, next) {
    try {
        const {id} = req.params

        // Validate ID exists and is a positive integer
        if (!id || !Number.isInteger(Number(id)) || Number(id) <= 0) {
            return res.status(400).json({ message: 'Valid transaction ID is required' });
        }

       const result = await sql `
            DELETE FROM transactions WHERE id = ${id}
            RETURNING *
        `
        if(result.length === 0){
            return res.status(404).json({
                message: "Transaction not found"
            })
        }

        res.status(200).json({
            message: 'Transaction has been deleted', 
        deletedTransaction: result[0]})
        
    } catch (error) {
        console.log('Error: Internal server error', error)
        next(error)
    }
}