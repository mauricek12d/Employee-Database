import dotenv from 'dotenv';
dotenv.config();

// Import and requier Pool
import pg from 'pg';    
const { Pool } = pg;

// Create a new Pool instance
const pool = new Pool({
  user: process.env.DB_USER,
  host: 'localhost',
  database: process.env.DB_DATABASE,
  password: process.env.DB_PASSWORD,
  port: 5432,
});

// connect to the database
const connectToDb = async () => {
  try {
    await pool.connect();
    console.log('Connected to the database');
  } catch (error) {
    console.error('Error connecting to the database: ', error);
    process.exit(1);
  }
};

export { pool, connectToDb };