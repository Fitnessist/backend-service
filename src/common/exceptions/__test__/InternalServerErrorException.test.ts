import { InternalServerErrorException } from "../InternalServerErrorException"

describe("InternalServerErrorException", () => {
    it("should create InternalServerErrorException", () => {
        const exception = new InternalServerErrorException("Internal server error")
        expect(exception).toBeInstanceOf(InternalServerErrorException)
        expect(exception.message).toBe("Internal server error")
        expect(exception.errorCode).toBe("INTERNAL_SERVER_ERROR")
        expect(exception.statusCode).toBe(500)
    })
})
