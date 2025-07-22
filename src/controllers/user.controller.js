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
    const { userId, balance } = req.body;
    

    // Update balance
    await sql`
      INSERT INTO users (user_id, balance)
      VALUES(${userId}, ${balance})
    `;

    res.status(200).json({
      message: "Balance updated successfully",
      userId,
      balance,
    });
  } catch (error) {
    console.error("Error updating balance:", error);
    res.status(500).json({ message: "Internal server error" });
  }
};

