/* istanbul ignore file */
import { type QueryConfig } from "pg"
import pool from "@infrastructure/database/postgres"

export default class TableTestHelper {
    private readonly tableName: string

    constructor (tableName: string) {
        this.tableName = tableName
    }

    public async addRow (data: Record<string, any>): Promise<void> {
        const columns = Object.keys(data).join(", ")
        const values = Object.values(data)
        const placeholders = values.map((_, index) => `$${index + 1}`).join(", ")

        const query: QueryConfig = {
            text: `INSERT INTO ${this.tableName} (${columns}) VALUES (${placeholders})`,
            values
        }

        await pool.query(query)
    }

    public async findRowsById (id: string): Promise<any | null> {
        const query: QueryConfig = {
            text: `SELECT * FROM ${this.tableName} WHERE id = $1`,
            values: [id]
        }

        const result = await pool.query(query)
        if (result.rowCount <= 0) {
            return null
        }
        return result.rows[0]
    }

    public async cleanTable (): Promise<void> {
        await pool.query(`DELETE FROM ${this.tableName}`)
    }

    public async closePool (): Promise<void> {
        await pool.end()
    }
}
