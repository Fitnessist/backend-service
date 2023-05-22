import { NotFoundException } from "../NotFoundException"

describe("NotFoundException", () => {
    it("should create NotFoundException", () => {
        const exception = new NotFoundException("Resource not found")
        expect(exception).toBeInstanceOf(NotFoundException)
        expect(exception.message).toBe("Resource not found")
        expect(exception.errorCode).toBe("NOT_FOUND")
        expect(exception.statusCode).toBe(404)
    })
})
