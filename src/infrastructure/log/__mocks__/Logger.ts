// src/infrastructure/log/__mocks__/Logger.ts

import { type Logger } from "../Logger"

export class MockLogger implements Logger {
    debug (message: string): void {
        console.log(message)
    }

    info (message: string): void {
        console.info(message)
    }

    warn (message: string): void {
        console.warn(message)
    }

    error (message: string): void {
        console.error(message)
    }
}
