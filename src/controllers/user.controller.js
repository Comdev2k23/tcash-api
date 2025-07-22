// controllers/userController.js
import { sql } from "../config/db.js";

export const getUserById = async (req, res) => {
  try {
    const {userId} = req.params

    const [user] = await sql`
      SELECT * FROM users WHERE user_id = ${userId}
    `;

    // if (!user) {
    //   return res.status(404).json({ message: "User not found." });
    // }

    return res.status(200).json({ user });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Server error" });
  }
};




export const updateUserBalance = async (req, res, next) => {
  try {
    const { userId, amount } = req.body;

    if (!userId || amount == null) {
      return res.status(400).json({ message: "Missing required fields" });
    }

    const parsedAmount = parseFloat(amount);
    if (isNaN(parsedAmount)) {
      return res.status(400).json({ message: "Invalid amount" });
    }

    // Get current balance first

    const newBalance = Number(user.balance) + parsedAmount;

    // Prevent balance from going negative
    if (newBalance < 0) {
      return res.status(400).json({ 
        message: "Insufficient funds",
        currentBalance: user.balance,
        attemptedUpdate: parsedAmount
      });
    }

    // Update balance
    await sql`
      UPDATE users 
      SET balance = ${newBalance}, updated_at = NOW()
      WHERE user_id = ${userId}
      RETURNING balance
    `;

    res.status(200).json({
      message: "Balance updated successfully",
      userId,
      newBalance,
      previousBalance: user.balance,
      change: parsedAmount
    });
  } catch (error) {
    console.error("Error updating balance:", error);
    res.status(500).json({ message: "Internal server error" });
  }
};

