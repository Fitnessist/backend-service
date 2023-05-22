import { type UserRepository } from "@domain/user/repository/UserRepository"
import { type Logger } from "@infrastructure/log/Logger"
import { type User } from "@domain/user/entity/User"
import { type PasswordEncryptorInterface } from "@application/security/PasswordEncoderInterface"
import { type RegisterUser } from "@domain/user/entity/RegisterUser"
import { ConflictException } from "@common/exceptions/ConflictException"

export class RegisterUserUseCase {
    private readonly userRepository: UserRepository
    private readonly logger: Logger
    private readonly passwordEncoder: PasswordEncryptorInterface

    constructor (
        userRepository: UserRepository,
        logger: Logger,
        passwordEncoder: PasswordEncryptorInterface
    ) {
        this.userRepository = userRepository
        this.logger = logger
        this.passwordEncoder = passwordEncoder
    }

    async execute (userData: RegisterUser): Promise<string | boolean> {
        try {
            const { username, password, email, name } = userData

            // Check if the email is already registered
            const existingEmail = await this.userRepository.findByEmail(email)
            if (existingEmail != null) {
                throw new ConflictException("Email is already registered")
            }

            // Encrypt the password before saving
            const encryptedPassword = await this.passwordEncoder.encrypt(
                password
            )

            // Create a new user object
            const newUser: User = {
                id: "",
                username,
                password: encryptedPassword,
                email,
                name,
                createdAt: undefined,
                updatedAt: undefined
            }

            // Save the new user to the repository
            const id = await this.userRepository.create(newUser)
            return id
        } catch (error: any) {
            this.logger.error(
                `Error during user registration: ${String(error.message)} + stack: ${String(error.stack)}`
            )
            throw error
        }
    }
}
