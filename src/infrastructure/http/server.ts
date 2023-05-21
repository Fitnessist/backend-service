import express, { type Request, type Response, type NextFunction } from "express"
import bodyParser from "body-parser"
import ErrorHandler from "@middleware/ErrorHandler"
import { ValidationException } from "@common/exceptions/ValidationException"
import { ForbiddenException } from "@common/exceptions/ForbiddenException"
import { UnauthorizedException } from "@common/exceptions/UnauthorizedException"
import { NotFoundException } from "@common/exceptions/NotFoundException"
import { ConflictException } from "@common/exceptions/ConflictException"
import { InternalServerErrorException } from "@common/exceptions/InternalServerErrorException"
import { ServiceUnavailableException } from "@common/exceptions/ServiceUnavailableException"
import { type Logger } from "@infrastructure/log/Logger"

export default class Server {
    private readonly app: express.Application
    private readonly port: number
    private readonly errorHandler: ErrorHandler
    private readonly logger: Logger

    public constructor (port: number, logger: Logger) {
        this.app = express()
        this.logger = logger
        this.port = port
        this.app.use(bodyParser.json())
        this.errorHandler = new ErrorHandler()
    }

    public registerErrorHandler (): void {
        this.app.use((err: any, req: Request, res: Response, next: NextFunction): void => {
            if (err instanceof ValidationException) {
                this.errorHandler.handleValidationException(err, req, res, next)
            } else if (err instanceof ForbiddenException) {
                this.errorHandler.handleForbiddenException(err, req, res, next)
            } else if (err instanceof UnauthorizedException) {
                this.errorHandler.handleUnauthorizedException(err, req, res, next)
            } else if (err instanceof NotFoundException) {
                this.errorHandler.handleNotFoundException(err, req, res, next)
            } else if (err instanceof ConflictException) {
                this.errorHandler.handleConflictException(err, req, res, next)
            } else if (err instanceof InternalServerErrorException) {
                this.errorHandler.handleInternalServerErrorException(err, req, res, next)
            } else if (err instanceof ServiceUnavailableException) {
                this.errorHandler.handleServiceUnavailableException(err, req, res, next)
            } else {
                //
            }
        })
    }

    public registerRoutes (router: express.Router): void {
        this.app.use("/api/v1", router)
    }

    public run (): void {
        this.app.listen(this.port, () => {
            this.logger.info(
                `Server listening  on http://localhost:${Number(this.port)}`
            )
        })
    }
}
