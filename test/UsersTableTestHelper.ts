/* istanbul ignore file */
import { type User } from "@domain/user/entity/User"
import pool from "@infrastructure/database/postgres"
import { type QueryConfig } from "pg"

export class UsersTableTestHelper {
    public async addUser ({
        id = "user-123",
        username = "dicoding",
        password = "secret",
        name = "Dicoding Indonesia"
    }): Promise<void> {
        const query = {
            text: "INSERT INTO users VALUES($1, $2, $3, $4)",
            values: [id, username, password, name]
        }

        await pool.query(query)
    }

    public async findUsersById (id: string): Promise<User[] | null> {
        const query: QueryConfig = {
            text: "SELECT * FROM users WHERE id = $1",
            values: [id]
        }

        const result = await pool.query(query)
        return result.rows
    }

    public async cleanTable (): Promise<void> {
        await pool.query("TRUNCATE TABLE users")
    }
}
