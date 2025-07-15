// src/middlewares/auth.middleware.js

import clerk from '@clerk/clerk-sdk-node';
import { sql } from '../config/db.js';

const { getAuth } = clerk;

// ✅ Middleware to decode Clerk token and attach userId
export const authMiddleware = (req, res, next) => {
  try {
    const { userId } = getAuth(req);

    if (!userId) {
      return res.status(401).json({ message: "Unauthorized: No userId found in token" });
    }

    req.userId = userId;
    next(); // ✅ MUST call next()
  } catch (error) {
    next(error);
  }
};

// ✅ Middleware to auto-create user in DB if not yet created
export const validateUserExists = async (req, res, next) => {
  try {
    const clerkId = req.userId;

    const [user] = await sql`
      SELECT * FROM users WHERE clerk_id = ${clerkId}
    `;

    if (!user) {
      await sql`
        INSERT INTO users (clerk_id, name, balance)
        VALUES (${clerkId}, '', 0.00)
      `;
    }

    next(); // ✅ MUST call next()
  } catch (error) {
    next(error);
  }
};
