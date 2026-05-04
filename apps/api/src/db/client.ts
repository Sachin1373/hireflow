import { Pool } from 'pg'
import dotenv from 'dotenv'
import path from 'path'


dotenv.config()

console.log("DATABASE_URL:", process.env.DATABASE_URL);

export const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
  ssl: {
    rejectUnauthorized: false,
  },
});

export default pool