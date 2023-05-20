import { UnauthorizedException } from "../UnauthorizedException"

describe("UnauthorizedException", () => {
    it("should create UnauthorizedException", () => {
        const exception = new UnauthorizedException("Unauthorized")
        expect(exception).toBeInstanceOf(UnauthorizedException)
        expect(exception.message).toBe("Unauthorized")
        expect(exception.errorCode).toBe("UNAUTHORIZED")
        expect(exception.statusCode).toBe(401)
    })
})
