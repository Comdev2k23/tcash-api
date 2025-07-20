import { neon } from "@neondatabase/serverless";
import "dotenv/config";

// SQL connection using your Neon DB URL
export const sql = neon(process.env.DB_URL);

export async function initDB() {
  try {
    // Create `users` table
    await sql`
      CREATE TABLE IF NOT EXISTS users (
        user_id VARCHAR(255) PRIMARY KEY,
        name VARCHAR(255) NOT NULL,
        balance DECIMAL(10, 2) NOT NULL DEFAULT 0.00
      );
    `;

    // Create `transactions` table
    await sql`
      CREATE TABLE IF NOT EXISTS transactions (
        id SERIAL PRIMARY KEY,
        user_id VARCHAR(255) NOT NULL,
        type VARCHAR(255) NOT NULL,
        refNumber VARCHAR(255) NOT NULL UNIQUE,
        amount DECIMAL(10, 2) NOT NULL,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      );
    `;

    //Create `notes` table
    await sql`
      CREATE TABLE IF NOT EXISTS notes (
      id SERIAL PRIMARY KEY,
      user_id VARCHAR(255) NOT NULL,
      is_done BOOLEAN DEFAULT FALSE,
      content VARCHAR(255) NOT NULL,
      created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      )
    `

    console.log("✅ Database initialized successfully");
  } catch (error) {
    console.error("❌ Error initializing DB", error);
    process.exit(1);
  }
}
