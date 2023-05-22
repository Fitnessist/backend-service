import { ForbiddenException } from "../ForbiddenException"

describe("ForbiddenException", () => {
    it("should create ForbiddenException", () => {
        const exception = new ForbiddenException("Access denied")
        expect(exception).toBeInstanceOf(ForbiddenException)
        expect(exception.message).toBe("Access denied")
        expect(exception.errorCode).toBe("FORBIDDEN")
        expect(exception.statusCode).toBe(403)
    })
})
