import { BaseException } from "./BaseException"

export class ConflictException extends BaseException {
    constructor (message: string = "Conflict") {
        const errorCode = "CONFLICT"
        const statusCode = 409
        super(message, errorCode, statusCode)
    }
}
