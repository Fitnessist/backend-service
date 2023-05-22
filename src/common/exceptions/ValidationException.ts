import { BaseException } from "./BaseException"

export class ValidationException extends BaseException {
    public details: any[]

    constructor (details: any[]) {
        const message = "Validation failed"
        const errorCode = "VALIDATION_ERROR"
        const statusCode = 400
        super(message, errorCode, statusCode)
        this.details = details
    }
}
