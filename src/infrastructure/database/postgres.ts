import { Pool, type PoolConfig } from "pg"

const dbConfig: PoolConfig = {
    user: process.env.DB_USER,
    password: process.env.DB_PASSWORD,
    host: process.env.DB_HOST,
    port: Number(process.env.DB_PORT),
    database: process.env.DB_NAME,
    max: 100,
    min: 5,
    idleTimeoutMillis: 60 * 1000 // 1 minute = 60.000 milliseconds
}

const pool = new Pool(dbConfig)

export default pool
