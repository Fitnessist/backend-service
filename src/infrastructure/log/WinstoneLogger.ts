import winston, { type Logger as WinstonLogger } from "winston"
import { type Logger } from "./Logger"

export class WLogger implements Logger {
    public readonly logger: WinstonLogger

    constructor () {
        this.logger = winston.createLogger({
            transports: [
                new winston.transports.Console({
                    format: winston.format.simple()
                })
            ]
        })
    }

    public info (message: string): void {
        this.logger.info(message)
    }

    public error (message: string): void {
        this.logger.error(message)
    }

    public warn (message: string): void {
        this.logger.warn(message)
    }

    public debug (message: string): void {
        this.logger.debug(message)
    }
}
