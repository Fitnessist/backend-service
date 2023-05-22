import { type Pool, type QueryConfig } from "pg"
import { type Token } from "@domain/user/entity/Token"
import { type TokenRepository } from "@domain/user/repository/TokenRepository"

export class TokenRepositoryPostgre implements TokenRepository {
    private readonly pool: Pool

    constructor (pool: Pool) {
        this.pool = pool
    }

    async saveToken (token: Token): Promise<void> {
        const query: QueryConfig = {
            text: "INSERT INTO refresh_tokens (user_id, refresh_token, expires_at) VALUES ($1, $2, $3)",
            values: [token.userId, token.refreshToken, token.expiresAt]
        }
        await this.pool.query(query)
    }

    async findTokenByRefreshToken (refreshToken: string): Promise<Token | null> {
        const query: QueryConfig = {
            text: "SELECT * FROM refresh_tokens WHERE refresh_token = $1",
            values: [refreshToken]
        }
        const result = await this.pool.query(query)
        if (result.rowCount === 0) {
            return null
        }
        const token: Token = {
            userId: result.rows[0].user_id,
            refreshToken: result.rows[0].refresh_token,
            id: result.rows[0].id,
            expiresAt: result.rows[0].expires_at
        }
        return token
    }

    async deleteToken (userId: string): Promise<void> {
        const query: QueryConfig = {
            text: "DELETE FROM refresh_tokens WHERE user_id = $1",
            values: [userId]
        }
        await this.pool.query(query)
    }
}
