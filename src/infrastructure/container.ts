import { createContainer } from "instances-container"
import { UserRepositoryPostgre } from "@infrastructure/repository/UserRepositoryPostgre"
import pool from "@infrastructure/database/postgres"
import { v4 as uuidGenerator } from "uuid"
import { WLogger } from "@infrastructure/log/WinstoneLogger"
import { BcryptPasswordEncryptor } from "@infrastructure/security/BcryptPasswordEncryptor"
import bcrypt from "bcrypt"
import { AuthController } from "@delivery/http/api/v1/controllers/Auth.controller"
import { RegisterUserUseCase } from "@application/user/usecase/RegistrationUseCase"
import { AuthenticationUseCase } from "@application/user/usecase/AuthenticationUseCase"
import { TokenRepositoryPostgre } from "./repository/TokenRepositoryPostgre"
import { ProgramRepositoryPostgre } from "@infrastructure/repository/ProgramRepositoryPostgre"
import { JwtGenerator } from "./security/JwtGenerator"
import ProgramUseCase from "@application/workout/usecase/ProgramUseCase"
import WorkoutRepositoryPostgre from "./repository/WorkoutRepositoryPostgre"
import WorkoutUseCase from "@application/workout/usecase/WorkoutUseCase"
import ExerciseUseCase from "@application/workout/usecase/ExerciseUseCase"
import ExerciseRepositoryPostgre from "./repository/ExerciseRepositoryPostgre"

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

// // JWT Service instance
container.register([
    {
        key: "JwtGenerator",
        Class: JwtGenerator
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

// token repository instance
container.register([
    {
        key: "TokenRepository",
        Class: TokenRepositoryPostgre,
        parameter: {
            dependencies: [
                {
                    concrete: pool
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

// Auth Use Case instance
container.register([
    {
        key: "AuthenticationUseCase",
        Class: AuthenticationUseCase,
        parameter: {
            dependencies: [
                {
                    internal: "UserRepository"
                },
                {
                    internal: "TokenRepository"
                },
                {
                    internal: "Logger"
                },
                {
                    internal: "PasswordEncryptionInterface"
                },
                {
                    internal: "JwtGenerator"
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
                },
                {
                    internal: "AuthenticationUseCase"
                }
            ]
        }
    }
])

// register ProgramRepository
container.register([
    {
        key: "ProgramRepository",
        Class: ProgramRepositoryPostgre,
        parameter: {
            dependencies: [
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

container.register([
    {
        key: "WorkoutRepository",
        Class: WorkoutRepositoryPostgre,
        parameter: {
            dependencies: [
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

container.register([
    {
        key: "ExerciseRepository",
        Class: ExerciseRepositoryPostgre,
        parameter: {
            dependencies: [
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

container.register([
    {
        key: "ProgramUseCase",
        Class: ProgramUseCase,
        parameter: {
            dependencies: [
                {
                    internal: "ProgramRepository"
                },
                {
                    internal: "Logger"
                }
            ]
        }
    }
])

container.register([
    {
        key: "WorkoutUseCase",
        Class: WorkoutUseCase,
        parameter: {
            dependencies: [
                {
                    internal: "Logger"
                },
                {
                    internal: "WorkoutRepository"
                }
            ]
        }
    }
])

container.register([
    {
        key: "ExerciseUseCase",
        Class: ExerciseUseCase,
        parameter: {
            dependencies: [
                {
                    internal: "ExerciseRepository"
                }
            ]
        }
    }
])

export default container
