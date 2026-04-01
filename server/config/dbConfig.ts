import { Pool, type PoolClient } from "pg";

const sslConfig = process.env.PG_SSL === "false" 
    ? false 
    : { rejectUnauthorized: process.env.NODE_ENV !== "production" ? false : true };

const pool = new Pool({
    connectionString: process.env.PG_CONNECTION_STRING?.replace("sslmode=require", "sslmode=verify-full"),
    ssl: sslConfig,
});

try {
    await pool.query('CREATE EXTENSION IF NOT EXISTS "uuid-ossp";');
    await pool.query('CREATE EXTENSION IF NOT EXISTS "pgcrypto";');
} catch (error) {
    console.error('Error initializing extensions:', error);
}

export { pool };
