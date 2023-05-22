import { type UserRepository } from "@domain/user/repository/UserRepository"
import { type Logger } from "@infrastructure/log/Logger"
import { type PasswordEncryptorInterface } from "@application/security/PasswordEncoderInterface"
import { type LoginUser } from "@domain/user/entity/LoginUser"
import { UnauthorizedException } from "@common/exceptions/UnauthorizedException"
import { type TokenService } from "@application/security/TokenService"
import { type TokenRepository } from "@domain/user/repository/TokenRepository"
import { type Token } from "@domain/user/entity/Token"

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
        try {
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

            const expiresInRefreshToken = 1 * 60 * 60 // 1 day = 3600 seconds
            // Generate refresh token
            const refreshToken = this.tokenService.generateRefreshToken(user.id, expiresInRefreshToken)
            const inDate = new Date(new Date().getSeconds() + expiresInRefreshToken)

            console.log("in date", inDate)

            // Save refresh token to the database
            const token: Token = {
                userId: user.id,
                refreshToken,
                expiresAt: inDate
            }
            await this.tokenRepository.saveToken(token)

            return { accessToken, refreshToken }
        } catch (error: any) {
            this.logger.error(`Error during user login: ${String(error.message)} + stack: ${String(error.stack)}`)
            throw error
        }
    }
}
