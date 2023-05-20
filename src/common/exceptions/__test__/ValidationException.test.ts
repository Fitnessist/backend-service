import { ValidationException } from "../ValidationException"

describe("ValidationException", () => {
    it("should create ValidationException", () => {
        const errors = ["Email is required", "Invalid phone number"]
        const exception = new ValidationException(errors)
        expect(exception).toBeInstanceOf(ValidationException)
        expect(exception.message).toBe("Validation failed")
        expect(exception.errorCode).toBe("VALIDATION_ERROR")
        expect(exception.statusCode).toBe(400)
        expect(exception.details).toEqual(errors)
    })
})
