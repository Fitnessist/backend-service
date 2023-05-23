import { Pool, type PoolConfig } from "pg"

const dbConfig: PoolConfig = {
    user: process.env.DATABASE_USER,
    password: process.env.DATABASE_PASSWORD,
    host: process.env.DATABASE_HOST,
    port: Number(process.env.DATABASE_PORT),
    database: process.env.DATABASE_NAME,
    max: 100,
    min: 5,
    idleTimeoutMillis: 60 * 1000 // 1 minute = 60.000 milliseconds
}

const pool = new Pool(dbConfig)

export default pool
