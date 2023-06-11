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
import { UserExerciseProgressRepositoryImpl } from "./repository/UserExerciseProgressRepositoryPostgre"
import { MyExerciseProgressUseCase } from "@application/usecase/my_progress/MyExerciseProgressUseCase"
import { MyExerciseProgressController } from "@delivery/http/api/v1/controllers/ProgramWorkout/MyExerciseProgressController"
import { ExerciseLevelRepositoryPostgre } from "./repository/ExerciseLevelRepositoryPostgre"
import { MyInventoryRepositoryPostgre } from "./repository/MyInventoryRepositoryPostgre"
import { MyInventoryUseCase } from "@application/usecase/my_progress/MyInventoryUseCase"
import { FoodPredictUseCase } from "@application/usecase/predict/FoodPredictUseCase"
import { createAxiosInstance } from "./http/axiosInstance"
import { GoogleCloudStorageService } from "./storage/CloudStorageService"
import { FoodRepositoryPostgre } from "./repository/FoodRepositoryPostgre"
import { UserProgramRepositoryPostgre } from "./repository/UserProgramRepositoryPostgre"
import { MyProgramUseCase } from "@application/usecase/my_progress/MyProgramUseCase"
import { UserPropertiesRepositoryPostgre } from "./repository/UserPropertiRepositoyPostgre"
import { TDECalculationUseCase } from "@application/user/usecase/TDECalculationUseCase"

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
                },
                {
                    internal: "ExerciseRepository"
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

container.register([
    {
        key: "MyProgressRepository",
        Class: UserExerciseProgressRepositoryImpl,
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
        key: "UserPropertiesRepository",
        Class: UserPropertiesRepositoryPostgre,
        parameter: {
            dependencies: [
                {
                    concrete: pool
                },
                {
                    concrete: uuidGenerator
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
        key: "MyInventoryRepository",
        Class: MyInventoryRepositoryPostgre,
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
        key: "MyProgramRepository",
        Class: UserProgramRepositoryPostgre,
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
        key: "ExerciseLevelRepository",
        Class: ExerciseLevelRepositoryPostgre,
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
        key: "MyExerciseProgressUseCase",
        Class: MyExerciseProgressUseCase,
        parameter: {
            dependencies: [
                {
                    internal: "MyProgressRepository"
                },
                {
                    internal: "UserRepository"
                },
                {
                    internal: "WorkoutRepository"
                },
                {
                    internal: "ExerciseLevelRepository"
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
        key: "MyProgramUseCase",
        Class: MyProgramUseCase,
        parameter: {
            dependencies: [
                {
                    internal: "MyProgramRepository"
                },
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
        key: MyInventoryUseCase.name,
        Class: MyInventoryUseCase,
        parameter: {
            dependencies: [
                {
                    internal: "MyInventoryRepository"
                },
                {
                    internal: "UserRepository"
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
        key: "FoodRepository",
        Class: FoodRepositoryPostgre,
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
        key: "MyExerciseProgressController",
        Class: MyExerciseProgressController,
        parameter: {
            dependencies: [
                {
                    internal: "MyExerciseProgressUseCase"
                }
            ]
        }
    }
])

container.register([
    {
        key: FoodPredictUseCase.name,
        Class: FoodPredictUseCase,
        parameter: {
            dependencies: [
                {
                    internal: "FoodRepository"
                },
                {
                    concrete: createAxiosInstance(
                        process.env.FOOD_PREDICT_MODEL_SERVICE_URL ?? ""
                    )
                },
                {
                    concrete: new GoogleCloudStorageService(process.env.STORAGE_BUCKET_NAME ?? "")
                },
                {
                    internal: "UserRepository"
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
        key: "TDECalculationUseCase",
        Class: TDECalculationUseCase,
        parameter: {
            dependencies: [
                {
                    internal: "UserPropertiesRepository"
                },
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

export default container
