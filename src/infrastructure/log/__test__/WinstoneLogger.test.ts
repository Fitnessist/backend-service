import { WLogger } from "../WinstoneLogger"

describe("WinstoneLogger", () => {
    let logger: WLogger

    beforeEach(() => {
        logger = new WLogger()
    })

    it("should log an info message", () => {
        const spy = jest.spyOn(logger.logger, "info")

        logger.info("This is an info message")

        expect(spy).toHaveBeenCalledWith("This is an info message")
    })

    it("should log an error message", () => {
        const spy = jest.spyOn(logger.logger, "error")

        logger.error("This is an error message")

        expect(spy).toHaveBeenCalledWith("This is an error message")
    })

    it("should log a warning message", () => {
        const spy = jest.spyOn(logger.logger, "warn")

        logger.warn("This is a warning message")

        expect(spy).toHaveBeenCalledWith("This is a warning message")
    })

    it("should log a debug message", () => {
        const spy = jest.spyOn(logger.logger, "debug")

        logger.debug("This is a debug message")

        expect(spy).toHaveBeenCalledWith("This is a debug message")
    })
})
