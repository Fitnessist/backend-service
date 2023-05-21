import { createContainer } from "instances-container"
import { UserRepositoryPostgre } from "@infrastructure/repository/UserRepositoryPostgre"
import pool from "@infrastructure/database/postgres"
import { v5 as uuidGenerator } from "uuid"
import { WLogger } from "@infrastructure/log/WinstoneLogger"
import { BcryptPasswordEncryptor } from "@infrastructure/security/BcryptPasswordEncryptor"
import bcrypt from "bcrypt"
import { AuthController } from "@delivery/http/api/v1/controllers/Auth.controller"
import { RegisterUserUseCase } from "@application/user/usecase/RegistrationUseCase"

const container = createContainer()

// Password Encoder instance
container.register([
    {
        key: "PasswordEncryptionInterface",
        Class: BcryptPasswordEncryptor,
        parameter: {
            dependencies: [
                {
                    concrete: bcrypt
                }
            ]
        }
    }
])

// Winstone Logger instance
container.register([
    {
        key: "Logger",
        Class: WLogger
    }
])

// user repository instance
container.register([
    {
        key: "UserRepository",
        Class: UserRepositoryPostgre,
        parameter: {
            dependencies: [
                {
                    internal: "Logger"
                },
                {
                    concrete: pool
                },
                {
                    concrete: uuidGenerator
                }
            ]
        }
    }
])

// Register Use Case instance
container.register([
    {
        key: "RegisterUserUseCase",
        Class: RegisterUserUseCase,
        parameter: {
            dependencies: [
                {
                    internal: "UserRepository"
                },
                {
                    internal: "Logger"
                },
                {
                    internal: "PasswordEncryptionInterface"
                }
            ]
        }
    }
])

// Auth controller instance
container.register([
    {
        key: "AuthController",
        Class: AuthController,
        parameter: {
            dependencies: [
                {
                    internal: "Logger"
                },
                {
                    internal: "RegisterUserUseCase"
                }
            ]
        }
    }
])

export default container
