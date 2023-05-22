import { type Pool, type QueryConfig, type QueryResult } from "pg"
import { type Token } from "@domain/user/entity/Token"
import { TokenRepositoryPostgre } from "../TokenRepositoryPostgre"

describe("TokenRepositoryPostgre", () => {
    let tokenRepository: TokenRepositoryPostgre
    let mockPool: Partial<Pool>

    const token: Token = {
        id: "token-123",
        userId: "user-123",
        refreshToken: "refresh-token-123",
        expiresAt: new Date()
    }

    beforeEach(() => {
        mockPool = {
            query: jest.fn()
        }
        tokenRepository = new TokenRepositoryPostgre(mockPool as Pool)
    })

    describe("saveToken function", () => {
        it("should save the token", async () => {
            const mockQueryResult: QueryResult = {
                rows: [],
                command: "",
                rowCount: 0,
                oid: 0,
                fields: []
            };

            (mockPool.query as jest.Mock).mockResolvedValueOnce(mockQueryResult)

            await tokenRepository.saveToken(token)

            const expectedQuery: QueryConfig = {
                text: "INSERT INTO refresh_tokens (user_id, refresh_token, expires_at) VALUES ($1, $2, $3)",
                values: [token.userId, token.refreshToken, token.expiresAt]
            }
            expect(mockPool.query).toHaveBeenCalledWith(expectedQuery)
        })
    })

    describe("findTokenByRefreshToken function", () => {
        it("should find the token by refresh token when found", async () => {
            const mockQueryResult: QueryResult = {
                rows: [
                    {
                        id: token.id,
                        user_id: token.userId,
                        refresh_token: token.refreshToken,
                        expires_at: token.expiresAt
                    }
                ],
                command: "",
                rowCount: 1,
                oid: 0,
                fields: []
            };

            (mockPool.query as jest.Mock).mockResolvedValueOnce(mockQueryResult)

            const result = await tokenRepository.findTokenByRefreshToken(token.refreshToken)

            expect(result).toEqual(token)

            const expectedQuery: QueryConfig = {
                text: "SELECT * FROM refresh_tokens WHERE refresh_token = $1 LIMIT 1",
                values: [token.refreshToken]
            }
            expect(mockPool.query).toHaveBeenCalledWith(expectedQuery)
        })

        it("should return null when token not found", async () => {
            const mockQueryResult: QueryResult = {
                rows: [],
                command: "",
                rowCount: 0,
                oid: 0,
                fields: []
            };

            (mockPool.query as jest.Mock).mockResolvedValueOnce(mockQueryResult)

            const result = await tokenRepository.findTokenByRefreshToken("unknown-refresh-token")

            expect(result).toBeNull()

            const expectedQuery: QueryConfig = {
                text: "SELECT * FROM refresh_tokens WHERE refresh_token = $1 LIMIT 1",
                values: ["unknown-refresh-token"]
            }
            expect(mockPool.query).toHaveBeenCalledWith(expectedQuery)
        })
    })

    describe("deleteToken function", () => {
        it("should delete the token", async () => {
            const mockQueryResult: QueryResult = {
                rows: [],
                command: "",
                rowCount: 0,
                oid: 0,
                fields: []
            };

            (mockPool.query as jest.Mock).mockResolvedValueOnce(mockQueryResult)

            await tokenRepository.deleteToken(token.userId)

            const expectedQuery: QueryConfig = {
                text: "DELETE FROM refresh_tokens WHERE user_id = $1",
                values: [token.userId]
            }
            expect(mockPool.query).toHaveBeenCalledWith(expectedQuery)
        })
    })
})
