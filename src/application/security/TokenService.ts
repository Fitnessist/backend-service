export interface TokenService {
    generateAccessToken: (userId: string) => string
    generateRefreshToken: (userId: string, expiresIn: string | number) => string
    verifyAccessToken: (token: string) => string | object
}
