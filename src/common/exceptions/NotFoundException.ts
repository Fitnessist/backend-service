import { BaseException } from "./BaseException"

export class NotFoundException extends BaseException {
    constructor (message?: string) {
        const msg = message ?? "Not Found"
        const errorCode = "NOT_FOUND"
        const statusCode = 404
        super(msg, errorCode, statusCode)
    }
}
