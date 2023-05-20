import { BaseException } from "./BaseException"

// Unauthorized exception
export class UnauthorizedException extends BaseException {
    constructor (message?: string) {
        const msg = message ?? "Unauthorized"
        const errorCode = "UNAUTHORIZED"
        const statusCode = 401
        super(msg, errorCode, statusCode)
    }
}
