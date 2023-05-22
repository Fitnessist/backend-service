/* eslint-disable import/first */
require("module-alias/register")

import { type Request, type Response } from "express"
import ErrorHandler from "../ErrorHandler"
import { ValidationException } from "@common/exceptions/ValidationException"
import { UnauthorizedException } from "@common/exceptions/UnauthorizedException"
import { ForbiddenException } from "@common/exceptions/ForbiddenException"
import { NotFoundException } from "@common/exceptions/NotFoundException"
import { InternalServerErrorException } from "@common/exceptions/InternalServerErrorException"
import { ConflictException } from "@common/exceptions/ConflictException"
import { HTTP_STATUS } from "@common/constants/HTTP_code"
import { ServiceUnavailableException } from "@common/exceptions/ServiceUnavailableException"

describe("ErrorHandler", () => {
    let errorHandler: ErrorHandler
    let req: Partial<Request>
    let res: Response
    let next: jest.Mock<any, any>

    beforeEach(() => {
        errorHandler = new ErrorHandler()
        req = {}
        res = {
            status: jest.fn().mockReturnThis(),
            json: jest.fn()
        } as unknown as Response
        next = jest.fn()
    })

    describe("handleValidationException", () => {
        it("should handle ValidationException", () => {
            const errors = [
                "Email Address should be a valid email",
                "Username not available"
            ]
            const err = new ValidationException(errors)

            errorHandler.handleValidationException(err, (req as Request), res, next)

            expect(res.status).toHaveBeenCalledWith(HTTP_STATUS.BAD_REQUEST)
            expect(res.json).toHaveBeenCalledWith({
                status: {
                    code: HTTP_STATUS.BAD_REQUEST,
                    message: "Bad Request"
                },
                error: {
                    message: "Validation failed",
                    code: "VALIDATION_ERROR",
                    details: errors
                }
            })
        })
    })

    describe("handleUnauthorizedException", () => {
        it("should handle UnauthorizedException", () => {
            const err = new UnauthorizedException()

            errorHandler.handleUnauthorizedException(err, (req as Request), res, next)

            expect(res.status).toHaveBeenCalledWith(HTTP_STATUS.UNAUTHORIZED)
            expect(res.json).toHaveBeenCalledWith({
                status: {
                    code: HTTP_STATUS.UNAUTHORIZED,
                    message: "Unauthorized"
                },
                error: {
                    message: "Unauthorized",
                    code: "UNAUTHORIZED"
                }
            })
        })
    })

    describe("handleForbiddenException", () => {
        it("should handle ForbiddenException", () => {
            const err = new ForbiddenException()

            errorHandler.handleForbiddenException(err, (req as Request), res, next)

            expect(res.status).toHaveBeenCalledWith(HTTP_STATUS.FORBIDDEN)
            expect(res.json).toHaveBeenCalledWith({
                status: {
                    code: HTTP_STATUS.FORBIDDEN,
                    message: "Forbidden"
                },
                error: {
                    message: "Forbidden",
                    code: "FORBIDDEN"
                }
            })
        })
    })

    describe("handleNotFoundException", () => {
        it("should handle NotFoundException", () => {
            const err = new NotFoundException()

            errorHandler.handleNotFoundException(err, (req as Request), res, next)

            expect(res.status).toHaveBeenCalledWith(HTTP_STATUS.NOT_FOUND)
            expect(res.json).toHaveBeenCalledWith({
                status: {
                    code: HTTP_STATUS.NOT_FOUND,
                    message: "NotFound"
                },
                error: {
                    message: "Not Found",
                    code: "NOT_FOUND"
                }
            })
        })
    })

    describe("handleInternalServerErrorException", () => {
        it("should handle InternalServerErrorException", () => {
            const err = new InternalServerErrorException()

            errorHandler.handleInternalServerErrorException(
                err,
                (req as Request),
                res,
                next
            )

            expect(res.status).toHaveBeenCalledWith(HTTP_STATUS.INTERNAL_SERVER_ERROR)
            expect(res.json).toHaveBeenCalledWith({
                status: {
                    code: HTTP_STATUS.INTERNAL_SERVER_ERROR,
                    message: "Internal Server Error"
                },
                error: {
                    message: "Internal Server Error",
                    code: "INTERNAL_SERVER_ERROR"
                }
            })
        })
    })

    describe("handleServiceUnavailableException", () => {
        it("should handle ServiceUnavailableException", () => {
            const err = new ServiceUnavailableException()

            errorHandler.handleServiceUnavailableException(err, (req as Request), res, next)

            expect(res.status).toHaveBeenCalledWith(HTTP_STATUS.SERVICE_UNAVAILABLE)
            expect(res.json).toHaveBeenCalledWith({
                status: {
                    code: HTTP_STATUS.SERVICE_UNAVAILABLE,
                    message: "Service Unavailable"
                },
                error: {
                    message: "Service Unavailable",
                    code: "SERVICE_UNAVAILABLE"
                }
            })
        })
    })

    describe("handleConflictException", () => {
        it("should handle ConflictException", () => {
            const err = new ConflictException()

            errorHandler.handleConflictException(err, (req as Request), res, next)

            expect(res.status).toHaveBeenCalledWith(HTTP_STATUS.CONFLICT)
            expect(res.json).toHaveBeenCalledWith({
                status: {
                    code: HTTP_STATUS.CONFLICT,
                    message: "Conflict"
                },
                error: {
                    message: "Conflict",
                    code: "CONFLICT"
                }
            })
        })
    })
})
