import { BaseException } from "./BaseException"

export class InternalServerErrorException extends BaseException {
    constructor (message?: string) {
        const msg = message ?? "Internal Server Error"
        const errorCode = "INTERNAL_SERVER_ERROR"
        const statusCode = 500
        super(msg, errorCode, statusCode)
    }
}
