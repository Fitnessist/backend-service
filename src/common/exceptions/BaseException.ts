// Abstract base exception class
export abstract class BaseException extends Error {
    public message: string
    public errorCode: string
    public statusCode: number

    constructor (
        message: string,
        errorCode: string,
        statusCode: number
    ) {
        super(message)
        this.name = this.constructor.name
        this.message = message
        this.errorCode = errorCode
        this.statusCode = statusCode
    }
}
