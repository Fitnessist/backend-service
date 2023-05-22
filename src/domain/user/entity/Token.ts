export interface Token {
    id?: string
    userId: string
    refreshToken: string
    expiresAt: Date
}
