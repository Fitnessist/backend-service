import { NotFoundException } from "@common/exceptions/NotFoundException"
import { ValidationException } from "@common/exceptions/ValidationException"
import { type MyExerciseProgressDTO } from "@domain/my_progress/dto/MyExerciseProgressDTO"
import { MyExerciseProgressResponseDTO } from "@domain/my_progress/dto/MyExerciseProgressResponseDTO"
import { MyExerciseProgress } from "@domain/my_progress/entity/MyExerciseProgress"
import { type MyProgramRepository } from "@domain/my_progress/repository/MyProgramRepository"
import { type MyProgressRepository } from "@domain/my_progress/repository/MyProgressRepository"
import { type UserRepository } from "@domain/user/repository/UserRepository"
import { type IExerciseLevelRepository } from "@domain/workout/repository/ExerciseLevelRepository"
import { type IWorkoutRepository } from "@domain/workout/repository/IWorkoutRepository"
import { type Logger } from "@infrastructure/log/Logger"

export class MyExerciseProgressUseCase {
    private readonly myProgressRepository: MyProgressRepository
    private readonly userRepo: UserRepository
    private readonly workokutRepo: IWorkoutRepository
    private readonly exerciseLvlRepo: IExerciseLevelRepository
    private readonly myProgramRepo: MyProgramRepository
    private readonly logger: Logger

    constructor (
        myProgressRepository: MyProgressRepository,
        userRepo: UserRepository,
        workoutRepo: IWorkoutRepository,
        exerciseLevelRepo: IExerciseLevelRepository,
        myProgramRepo: MyProgramRepository,
        logger: Logger
    ) {
        this.myProgressRepository = myProgressRepository
        this.userRepo = userRepo
        this.workokutRepo = workoutRepo
        this.exerciseLvlRepo = exerciseLevelRepo
        this.myProgramRepo = myProgramRepo
        this.logger = logger
    }

    public async findByUser (userId: string): Promise<MyExerciseProgressResponseDTO[]> {
        try {
            const myProgressList = await this.myProgressRepository.findByUserId(
                userId
            )
            if (myProgressList == null || myProgressList.length <= 0) {
                throw new NotFoundException()
            }
            const response = myProgressList.map((data) => {
                return new MyExerciseProgressResponseDTO({ ...data })
            })

            return response
        } catch (error) {
            // Handle any errors that occurred during the process
            console.error(
                "Error occurred while finding MyExerciseProgress by user:",
                error
            )
            throw error
        }
    }

    public async create (
        myProgressDTO: MyExerciseProgressDTO
    ): Promise<MyExerciseProgressResponseDTO> {
        try {
            // Perform any necessary validation or business logic before creating
            const userPromise = this.userRepo.findById(myProgressDTO.userId)
            const workoutPromise = this.workokutRepo.findById(myProgressDTO.workoutId)
            const exerciseLevelPromise = this.exerciseLvlRepo.findById(myProgressDTO.exerciseLevelId)

            const myProgramPromise = this.myProgramRepo.findByProgramId(myProgressDTO.programId)
            const [user, workout, exericseLevel, myProgram] = await Promise.all([
                userPromise,
                workoutPromise,
                exerciseLevelPromise,
                myProgramPromise
            ])

            const errors = []
            if (user == null) {
                const error = {
                    field: "user_id",
                    message: "user not found"
                }
                errors.push(error)
            }
            if (workout == null) {
                const error = {
                    field: "workout_id",
                    message: "workout not found"
                }
                errors.push(error)
            }
            if (exericseLevel == null) {
                const error = {
                    field: "exercise_level_id",
                    message: "exercise_level_id not found"
                }
                errors.push(error)
            }
            if (myProgram == null) {
                const error = {
                    field: "program_id",
                    message: "this program_id doesn't the choosen program"
                }
                errors.push(error)
            }

            if (errors.length > 0) {
                throw new ValidationException(errors)
            }
            const myProgress = new MyExerciseProgress({
                id: "",
                programId: myProgressDTO.programId,
                workoutId: myProgressDTO.workoutId,
                exerciseId: myProgressDTO.exerciseId,
                exerciseLevelId: myProgressDTO.exerciseLevelId,
                userId: myProgressDTO.userId
            })
            const createdMyProgress = await this.myProgressRepository
                .create(myProgress)

            const responseData = new MyExerciseProgressResponseDTO(createdMyProgress)
            return responseData
        } catch (error: any) {
            this.logger.error(error?.message)
            throw error
        }
    }

    public async update (
        myProgress: MyExerciseProgress
    ): Promise<MyExerciseProgress> {
        try {
            // Perform any necessary validation or business logic before updating
            const updatedMyProgress = await this.myProgressRepository.update(
                myProgress
            )
            return updatedMyProgress
        } catch (error: any) {
            // Handle any errors that occurred during the process
            this.logger.error(error.message)
            throw error
        }
    }
}
