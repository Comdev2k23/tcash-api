import { neon } from "@neondatabase/serverless";
import "dotenv/config"

//Sql connection from DB url
export const sql = neon(process.env.DB_URL)

export async function initDB () {
    try {
        await sql`
            CREATE TABLE IF NOT EXISTS transactions(
                id SERIAL PRIMARY KEY,
                user_id VARCHAR(255) NOT NULL,
                name VARCHAR(255) NOT NULL,
                type VARCHAR(255) NOT NULL,
                refNumber VARCHAR(255) NOT NULL,
                amount DECIMAL(10, 2) NOT NULL,
                created_at DATE NOT NULL DEFAULT CURRENT_DATE
            )
        `
        console.log('Database initialized successfully')
    } catch (error) {
        console.log('Error initializing DB', error)
        process.exit(1)
    }
}