import { type TokenService } from "@application/security/TokenService"
import { UnauthorizedException } from "@common/exceptions/UnauthorizedException"
import jwt, { type SignOptions, type JwtPayload } from "jsonwebtoken"

export class JwtGenerator implements TokenService {
    private readonly secretKey: string
    private readonly expiresIn: string

    constructor (secretKey: string = "123123131", expiresIn: string = "1h") {
        this.secretKey = secretKey
        this.expiresIn = expiresIn
    }

    generateAccessToken (userId: string): string {
        const payload: JwtPayload = {
            jti: userId
        }

        const token = jwt.sign(payload, this.secretKey, { expiresIn: this.expiresIn })
        return token
    }

    generateRefreshToken (userId: string, expiresDuration: string | number = "1d"): string {
        const payload: JwtPayload = {
            jti: userId
        }
        const jwtOpt: SignOptions = {
            expiresIn: expiresDuration
        }

        const refreshToken = jwt.sign(payload, this.secretKey, jwtOpt)
        return refreshToken
    }

    verifyAccessToken (token: string): string | object {
        try {
            const decoded = jwt.verify(token, this.secretKey)
            return decoded
        } catch (error: any) {
            throw new UnauthorizedException("Invalid access token")
        }
    }
}
