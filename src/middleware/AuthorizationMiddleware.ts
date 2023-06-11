// src/middleware/authorization.ts

import { type Request, type Response, type NextFunction } from "express"
import { JwtGenerator } from "@infrastructure/security/JwtGenerator"
import { UnauthorizedException } from "@common/exceptions/UnauthorizedException"
import container from "@infrastructure/container"
import { type UserRepository } from "@domain/user/repository/UserRepository"
import { type JwtPayload } from "jsonwebtoken"

const jwtGenerator = new JwtGenerator()

export const authorizationMiddleware = (
    req: Request,
    res: Response,
    next: NextFunction
): void => {
    try {
        // Mendapatkan token dari header Authorization
        const authHeader = req.headers.authorization
        if (authHeader === null || authHeader === undefined) {
            throw new UnauthorizedException(
                "Access denied. No token provided."
            )
        }

        // Memeriksa format token
        const [bearer, token] = authHeader.split(" ")
        if (bearer !== "Bearer" || token.length === 0) {
            throw new UnauthorizedException("Invalid token format.")
        }

        // Memverifikasi token menggunakan JwtGenerator
        const decoded = jwtGenerator.verifyAccessToken(token) as JwtPayload

        // Menyimpan payload token ke dalam objek req
        const userId = decoded.jti
        if (userId === undefined) {
            throw new UnauthorizedException()
        }

        const userRepo = container.getInstance(
            "UserRepository"
        ) as UserRepository

        console.log("userId", userId)
        userRepo
            .findById(userId)
            .then((user) => {
                if (user == null) {
                    const error = new UnauthorizedException()
                    next(error)
                    return
                }

                req.currentUser = user
                next()
            })
            .catch((error) => {
                throw error
            })
    } catch (error: any) {
        // Menangani exception jika terjadi Unauthorized
        next(error)
    }
}
