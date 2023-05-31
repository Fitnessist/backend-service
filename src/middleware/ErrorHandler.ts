import { type ConflictException } from "@common/exceptions/ConflictException"
import { type ForbiddenException } from "@common/exceptions/ForbiddenException"
import { type InternalServerErrorException } from "@common/exceptions/InternalServerErrorException"
import { type NotFoundException } from "@common/exceptions/NotFoundException"
import { type UnauthorizedException } from "@common/exceptions/UnauthorizedException"
import { type ValidationException } from "@common/exceptions/ValidationException"
import { type Request, type Response, type NextFunction } from "express"

interface ErrorResponse {
    status: {
        code: number
        message: string
    }
    error: {
        message: string
        code: string
        details?: any[]
    }
}

class ErrorHandler {
    public handleValidationException (
        err: ValidationException,
        req: Request,
        res: Response,
        next: NextFunction
    ): void {
        const response: ErrorResponse = {
            status: {
                code: err.statusCode,
                message: "Bad Request"
            },
            error: {
                message: err.message,
                code: err.errorCode,
                details: err.details
            }
        }
        res.status(err.statusCode).json(response)
    }

    public handleUnauthorizedException (
        err: UnauthorizedException,
        req: Request,
        res: Response,
        next: NextFunction
    ): void {
        const response: ErrorResponse = {
            status: {
                code: err.statusCode,
                message: "Unauthorized"
            },
            error: {
                message: err.message,
                code: err.errorCode
            }
        }
        res.status(err.statusCode).json(response)
    }

    public handleForbiddenException (
        err: ForbiddenException,
        req: Request,
        res: Response,
        next: NextFunction
    ): void {
        const response: ErrorResponse = {
            status: {
                code: err.statusCode,
                message: "Forbidden"
            },
            error: {
                message: err.message,
                code: err.errorCode
            }
        }
        res.status(err.statusCode).json(response)
    }

    public handleNotFoundException (
        err: NotFoundException,
        req: Request,
        res: Response,
        next: NextFunction
    ): void {
        const response: ErrorResponse = {
            status: {
                code: err.statusCode,
                message: "NotFound"
            },
            error: {
                message: err.message,
                code: err.errorCode
            }
        }
        res.status(err.statusCode).json(response)
    }

    public handleInternalServerErrorException (
        err: InternalServerErrorException,
        req: Request,
        res: Response,
        next: NextFunction
    ): void {
        const response: ErrorResponse = {
            status: {
                code: err.statusCode ?? 500,
                message: "Internal Server Error"
            },
            error: {
                message: err.message,
                code: err.errorCode ?? "INTERNAL_SERVER_ERROR"
            }
        }
        res.status(err.statusCode ?? 500).json(response)
    }

    public handleServiceUnavailableException (
        err: ConflictException,
        req: Request,
        res: Response,
        next: NextFunction
    ): void {
        const response: ErrorResponse = {
            status: {
                code: err.statusCode,
                message: "Service Unavailable"
            },
            error: {
                message: err.message,
                code: err.errorCode
            }
        }
        res.status(err.statusCode).json(response)
    }

    public handleConflictException (
        err: ConflictException,
        req: Request,
        res: Response,
        next: NextFunction
    ): void {
        const response: ErrorResponse = {
            status: {
                code: err.statusCode,
                message: "Conflict"
            },
            error: {
                message: err.message,
                code: err.errorCode
            }
        }
        res.status(err.statusCode).json(response)
    }
}

export default ErrorHandler
