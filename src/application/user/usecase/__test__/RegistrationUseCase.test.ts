import { RegisterUserUseCase } from "../RegistrationUseCase"
import { type UserRepository } from "@domain/user/repository/UserRepository"
import { type Logger } from "@infrastructure/log/Logger"
import { RegisterUser } from "@domain/user/entity/RegisterUser"
import { type PasswordEncryptorInterface } from "@application/security/PasswordEncoderInterface"

describe("RegisterUserUseCase", () => {
    let userRepository: UserRepository
    let logger: Logger
    let mockPasswordEncoder: Partial<PasswordEncryptorInterface>
    let registerUserUseCase: RegisterUserUseCase

    beforeEach(() => {
        // Create mock instances for the dependencies
        userRepository = {
            findByEmail: jest.fn(),
            create: jest.fn(),
            findById: jest.fn()
        }
        logger = {
            info: jest.fn(),
            error: jest.fn(),
            warn: jest.fn(),
            debug: jest.fn()
        }
        mockPasswordEncoder = {
            encrypt: jest.fn(),
            validate: jest.fn()
        }

        // Create an instance of RegisterUserUseCase
        registerUserUseCase = new RegisterUserUseCase(
            userRepository,
            logger,
            mockPasswordEncoder as PasswordEncryptorInterface
        )
    })

    it("should register a new user successfully", async () => {
        // Create a mock user data
        const userData: RegisterUser = new RegisterUser({
            username: "john_doe",
            email: "john.doe@example.com",
            name: "John Doe",
            password: "password",
            passwordConfirmation: "password"
        });

        // Mock the userRepository.findByEmail method to return null (email not found)
        (userRepository.findByEmail as jest.Mock).mockResolvedValueOnce(null);

        // Mock the passwordEncoder.encrypt method to return the hashed password
        (mockPasswordEncoder.encrypt as jest.Mock).mockResolvedValueOnce(
            "hashedPassword"
        )

        // Call the execute method
        await registerUserUseCase.execute(userData)

        // Verify that the userRepository.findByEmail method was called with the correct email
        expect(userRepository.findByEmail).toHaveBeenCalledWith(
            "john.doe@example.com"
        )

        // Verify that the passwordEncoder.encrypt method was called with the correct password
        expect(mockPasswordEncoder.encrypt).toHaveBeenCalledWith("password")

        // Verify that the userRepository.create method was called with the new user object
        expect(userRepository.create).toHaveBeenCalledWith({
            id: expect.any(String),
            username: "john_doe",
            password: "hashedPassword",
            email: "john.doe@example.com",
            name: "John Doe"
        })
    })

    it("should throw an error if the email is already registered", async () => {
        // Create a mock user data
        const userData: RegisterUser = new RegisterUser({
            username: "john_doe",
            email: "john.doe@example.com",
            name: "John Doe",
            password: "password",
            passwordConfirmation: "password"
        });

        // Mock the userRepository.findByEmail method to return an existing user object
        (userRepository.findByEmail as jest.Mock).mockResolvedValueOnce({
            id: "user-123",
            username: "john_doe",
            password: "hashedPassword",
            email: "john.doe@example.com",
            name: "John Doe"
        })

        // Call the execute method and expect it to throw an error
        await expect(
            registerUserUseCase.execute(userData)
        ).rejects.toThrowError("Email is already registered")

        // Verify that the passwordEncoder.encrypt method was not called
        expect(mockPasswordEncoder.encrypt).not.toHaveBeenCalled()
    })
})
