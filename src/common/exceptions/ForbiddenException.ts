import { BaseException } from "./BaseException"

export class ForbiddenException extends BaseException {
    constructor (message?: string) {
        const msg = message ?? "Forbidden"
        const errorCode = "FORBIDDEN"
        const statusCode = 403
        super(msg, errorCode, statusCode)
    }
}
