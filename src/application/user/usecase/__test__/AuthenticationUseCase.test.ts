import { AuthenticationUseCase } from "../AuthenticationUseCase"
import { type UserRepository } from "@domain/user/repository/UserRepository"
import { type Logger } from "@infrastructure/log/Logger"
import { type PasswordEncryptorInterface } from "@application/security/PasswordEncoderInterface"
import { type LoginUser } from "@domain/user/entity/LoginUser"
import { UnauthorizedException } from "@common/exceptions/UnauthorizedException"
import { type TokenService } from "@application/security/TokenService"
import { type TokenRepository } from "@domain/user/repository/TokenRepository"

describe("AuthenticationUseCase", () => {
    let authenticationUseCase: AuthenticationUseCase
    let mockUserRepository: UserRepository
    let mockTokenRepository: TokenRepository
    let mockLogger: Logger
    let mockPasswordEncoder: PasswordEncryptorInterface
    let mockJwtService: TokenService
    // Arrange
    const userData: Partial<LoginUser> = {
        email: "unknown@example.com",
        password: "password",
        getEmail: jest.fn(),
        getPassword: jest.fn()
    }

    beforeEach(() => {
        mockUserRepository = {
            findByEmail: jest.fn()
        } as unknown as UserRepository

        mockTokenRepository = {
            saveToken: jest.fn()
        } as unknown as TokenRepository

        mockLogger = {
            error: jest.fn()
        } as unknown as Logger

        mockPasswordEncoder = {
            validate: jest.fn()
        } as unknown as PasswordEncryptorInterface

        mockJwtService = {
            generateAccessToken: jest.fn(),
            generateRefreshToken: jest.fn(),
            verifyAccessToken: jest.fn()
        } as unknown as TokenService

        authenticationUseCase = new AuthenticationUseCase(
            mockUserRepository,
            mockTokenRepository,
            mockLogger,
            mockPasswordEncoder,
            mockJwtService
        )
    })

    describe("loginUser", () => {
        it("should return access token and refresh token when credentials are valid", async () => {
            const user = {
                id: "user-id",
                email: userData.email,
                password: "hashedPassword"
            }

            const accessToken = "access-token"
            const refreshToken = "refresh-token";

            (mockUserRepository.findByEmail as jest.Mock).mockResolvedValueOnce(user);
            (mockPasswordEncoder.validate as jest.Mock).mockResolvedValueOnce(true);
            (mockJwtService.generateAccessToken as jest.Mock).mockReturnValueOnce(accessToken);
            (mockJwtService.generateRefreshToken as jest.Mock).mockReturnValueOnce(refreshToken)

            // Act
            const result = await authenticationUseCase.loginUser(userData as LoginUser)

            // Assert
            expect(result).toEqual({ accessToken, refreshToken })
            expect(mockUserRepository.findByEmail).toHaveBeenCalledWith(userData.email)
            expect(mockPasswordEncoder.validate).toHaveBeenCalledWith(userData.password, user.password)
            expect(mockJwtService.generateAccessToken).toHaveBeenCalledWith(user.id)
            expect(mockJwtService.generateRefreshToken).toHaveBeenCalledWith(user.id, 3600)
            expect(mockTokenRepository.saveToken).toHaveBeenCalledWith(
                expect.objectContaining({
                    userId: user.id,
                    refreshToken
                })
            )
        })

        it("should throw UnauthorizedException when email is not found", async () => {
            (mockUserRepository.findByEmail as jest.Mock).mockResolvedValueOnce(null)

            // Act & Assert
            await expect(authenticationUseCase.loginUser(userData as LoginUser)).rejects.toThrow(UnauthorizedException)
            expect(mockUserRepository.findByEmail).toHaveBeenCalledWith(userData.email)
            expect(mockPasswordEncoder.validate).not.toHaveBeenCalled()
            expect(mockJwtService.generateAccessToken).not.toHaveBeenCalled()
            expect(mockJwtService.generateRefreshToken).not.toHaveBeenCalled()
            expect(mockTokenRepository.saveToken).not.toHaveBeenCalled()
        })

        it("should throw UnauthorizedException when password is invalid", async () => {
            const user = {
                id: "user-id",
                email: userData.email,
                password: "hashedPassword"
            };

            (mockUserRepository.findByEmail as jest.Mock).mockResolvedValueOnce(user);
            (mockPasswordEncoder.validate as jest.Mock).mockResolvedValueOnce(false)

            // Act & Assert
            await expect(authenticationUseCase.loginUser(userData as LoginUser)).rejects.toThrow(UnauthorizedException)
            expect(mockUserRepository.findByEmail).toHaveBeenCalledWith(userData.email)
            expect(mockPasswordEncoder.validate).toHaveBeenCalledWith(userData.password, user.password)
            expect(mockJwtService.generateAccessToken).not.toHaveBeenCalled()
            expect(mockTokenRepository.saveToken).not.toHaveBeenCalled()
        })

        it("should throw and log an error when an exception occurs", async () => {
            const error = new Error("Something went wrong");

            (mockUserRepository.findByEmail as jest.Mock).mockRejectedValueOnce(error)

            // Act & Assert
            await expect(authenticationUseCase.loginUser(userData as LoginUser)).rejects.toThrow(error)
            expect(mockUserRepository.findByEmail).toHaveBeenCalledWith(userData.email)
            expect(mockPasswordEncoder.validate).not.toHaveBeenCalled()
            expect(mockJwtService.generateAccessToken).not.toHaveBeenCalled()
            expect(mockTokenRepository.saveToken).not.toHaveBeenCalled()
            expect(mockLogger.error).toHaveBeenCalledWith(
                `Error during user login: ${String(error.message)} + stack: ${String(error.stack)}`
            )
        })
    })
})
