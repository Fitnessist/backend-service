import { type Token } from "@domain/user/entity/Token"

export interface TokenRepository {
    saveToken: (token: Token) => Promise<void>
    findTokenByRefreshToken: (refreshToken: string) => Promise<Token | null>
    deleteToken: (userId: string) => Promise<void>
}
