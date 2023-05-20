import { BaseException } from "./BaseException"

export class ServiceUnavailableException extends BaseException {
    constructor (message: string = "Service Unavailable") {
        const errorCode = "SERVICE_UNAVAILABLE"
        const statusCode = 503
        super(message, errorCode, statusCode)
    }
}
