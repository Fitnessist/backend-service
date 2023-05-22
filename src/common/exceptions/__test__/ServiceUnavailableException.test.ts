import { ServiceUnavailableException } from "../ServiceUnavailableException"

describe("ServiceUnavailableException", () => {
    it("should create ServiceUnavailableException", () => {
        const exception = new ServiceUnavailableException("Service unavailable")
        expect(exception).toBeInstanceOf(ServiceUnavailableException)
        expect(exception.message).toBe("Service unavailable")
        expect(exception.errorCode).toBe("SERVICE_UNAVAILABLE")
        expect(exception.statusCode).toBe(503)
    })
})
