// controllers/userController.js
import { sql } from "../config/db.js";

export const getUserById = async (req, res) => {
  try {
    const {userId} = req.params

    const [user] = await sql`
      SELECT * FROM users WHERE user_id = ${userId}
    `;

    if (!user) {
      return res.status(404).json({ message: "User not found." });
    }

    return res.status(200).json({ user });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Server error" });
  }
};



export async function updateUser(req, res, next) {
  try {
    const { userId, name, balance } = req.body;

    if (!userId || !name || balance == null) {
      return res.status(400).json({ message: "Missing required fields" });
    }

    const parsedBalance = parseFloat(balance);
    if (isNaN(parsedBalance) || parsedBalance < 0) {
      return res.status(400).json({ message: "Invalid balance amount" });
    }

    // ✅ UPSERT using ON CONFLICT
    await sql`
      INSERT INTO users (user_id, name, balance)
      VALUES (${userId}, ${name}, ${parsedBalance})
      ON CONFLICT (user_id) DO UPDATE
      SET name = ${name}, balance = ${parsedBalance}
    `;

    res.status(200).json({
      message: "User upserted successfully",
      userId,
      name,
      balance: parsedBalance,
    });
  } catch (error) {
    console.error("Error upserting user:", error);
    res.status(500).json({ message: "Internal server error" });
  }
}
