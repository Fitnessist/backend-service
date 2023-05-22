import { ConflictException } from "../ConflictException"

describe("ConflictException", () => {
    it("should create ConflictException", () => {
        const exception = new ConflictException("Conflict occurred")
        expect(exception).toBeInstanceOf(ConflictException)
        expect(exception.message).toBe("Conflict occurred")
        expect(exception.errorCode).toBe("CONFLICT")
        expect(exception.statusCode).toBe(409)
    })
})
