import jwt from "jsonwebtoken"
import { JwtGenerator } from "../JwtGenerator"
import { UnauthorizedException } from "@common/exceptions/UnauthorizedException"

jest.mock("jsonwebtoken")

describe("JwtGenerator", () => {
    const mockSecretKey = "mock-secret-key"
    const mockExpiresIn = "1h"
    const mockUserId = "mock-user-id"
    const mockToken = "mock-token"

    let jwtGenerator: JwtGenerator

    beforeEach(() => {
        jwtGenerator = new JwtGenerator(mockSecretKey, mockExpiresIn)
    })

    afterEach(() => {
        jest.resetAllMocks()
    })

    describe("generateAccessToken", () => {
        it("should generate an access token", () => {
            const mockSign = jest.spyOn(jwt, "sign").mockImplementation(() => mockToken)

            const result = jwtGenerator.generateAccessToken(mockUserId)

            expect(mockSign).toHaveBeenCalledWith(
                {
                    iss: "fitnessist app",
                    jti: mockUserId
                },
                mockSecretKey,
                { expiresIn: mockExpiresIn }
            )
            expect(result).toBe(mockToken)
        })
    })

    describe("generateRefreshToken", () => {
        it("should generate a refresh token", () => {
            const mockSign = jest.spyOn(jwt, "sign").mockImplementation(() => mockToken)

            const result = jwtGenerator.generateRefreshToken(mockUserId, "1d")

            expect(mockSign).toHaveBeenCalledWith(
                {
                    iss: "fitnessist app",
                    jti: mockUserId
                },
                mockSecretKey,
                {
                    expiresIn: "1d"
                }
            )
            expect(result).toBe(mockToken)
        })
    })

    describe("verifyAccessToken", () => {
        it("should verify a valid access token", () => {
            const mockVerify = jest.spyOn(jwt, "verify").mockImplementation(() => ({ userId: mockUserId }))

            const result = jwtGenerator.verifyAccessToken(mockToken)

            expect(mockVerify).toHaveBeenCalledWith(mockToken, mockSecretKey)
            expect(result).toEqual({ userId: mockUserId })
        })

        it("should throw UnauthorizedException for an invalid access token", () => {
            jest.spyOn(jwt, "verify").mockImplementation(() => {
                throw new Error("Invalid token")
            })

            expect(() => {
                jwtGenerator.verifyAccessToken(mockToken)
            }).toThrow(UnauthorizedException)
        })
    })
})
