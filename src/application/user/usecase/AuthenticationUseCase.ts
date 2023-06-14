import { type UserRepository } from "@domain/user/repository/UserRepository"
import { type Logger } from "@infrastructure/log/Logger"
import { type PasswordEncryptorInterface } from "@application/security/PasswordEncoderInterface"
import { type LoginUser } from "@domain/user/entity/LoginUser"
import { UnauthorizedException } from "@common/exceptions/UnauthorizedException"
import { type TokenService } from "@application/security/TokenService"
import { type TokenRepository } from "@domain/user/repository/TokenRepository"
import { type Token } from "@domain/user/entity/Token"
import UserResponseDTO from "@domain/user/entity/UserResponseDTO"
import { NotFoundException } from "@common/exceptions/NotFoundException"

export class AuthenticationUseCase {
    private readonly userRepository: UserRepository
    private readonly tokenRepository: TokenRepository
    private readonly logger: Logger
    private readonly passwordEncoder: PasswordEncryptorInterface
    private readonly tokenService: TokenService

    constructor (
        userRepository: UserRepository,
        tokenRepository: TokenRepository,
        logger: Logger,
        passwordEncoder: PasswordEncryptorInterface,
        tokenService: TokenService
    ) {
        this.userRepository = userRepository
        this.tokenRepository = tokenRepository
        this.logger = logger
        this.passwordEncoder = passwordEncoder
        this.tokenService = tokenService
    }

    public async loginUser (userData: LoginUser): Promise<{ accessToken: string, refreshToken: string }> {
        const { email, password } = userData

        // Find user by email
        const user = await this.userRepository.findByEmail(email)
        if (user == null) {
            throw new UnauthorizedException("Invalid credentials")
        }

        // Check if the password is correct
        const isPasswordValid = await this.passwordEncoder.validate(password, user.password)
        if (!isPasswordValid) {
            throw new UnauthorizedException("Invalid credentials")
        }

        // Generate access token
        const accessToken = this.tokenService.generateAccessToken(user.id)

        const refreshTokenExpires = 12 * 4 * 7 * 24 * 60 * 60 // 1 tahun
        // Generate refresh token
        const refreshToken = this.tokenService.generateRefreshToken(user.id, refreshTokenExpires)
        const refreshTokenExpiresInDate = new Date(new Date().getSeconds() + refreshTokenExpires)

        // Save refresh token to the database
        const token: Token = {
            userId: user.id,
            refreshToken,
            expiresAt: refreshTokenExpiresInDate
        }
        await this.tokenRepository.saveToken(token)

        return { accessToken, refreshToken }
    }

    public async findById (userId: string): Promise<UserResponseDTO> {
        const user = await this.userRepository.findById(userId)
        if (user === null) {
            throw new NotFoundException()
        }

        const response = new UserResponseDTO(user)
        return response
    }
}
