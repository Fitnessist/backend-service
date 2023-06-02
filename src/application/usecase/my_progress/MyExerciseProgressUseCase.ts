import { ValidationException } from "@common/exceptions/ValidationException"
import { type MyExerciseProgressDTO } from "@domain/my_progress/dto/MyExerciseProgressDTO"
import { MyExerciseProgress } from "@domain/my_progress/entity/MyExerciseProgress"
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
    private readonly logger: Logger

    constructor (
        myProgressRepository: MyProgressRepository,
        userRepo: UserRepository,
        workoutRepo: IWorkoutRepository,
        exerciseLevelRepo: IExerciseLevelRepository,
        logger: Logger
    ) {
        this.myProgressRepository = myProgressRepository
        this.userRepo = userRepo
        this.workokutRepo = workoutRepo
        this.exerciseLvlRepo = exerciseLevelRepo
        this.logger = logger
    }

    public async findByUser (
        userId: string
    ): Promise<MyExerciseProgress[] | null> {
        try {
            const myProgressList = await this.myProgressRepository.findByUserId(
                userId
            )
            return myProgressList
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
    ): Promise<MyExerciseProgress> {
        try {
            const myProgress = MyExerciseProgress.builder()
                .setUserId(myProgressDTO.userId)
                .setProgramId(myProgressDTO.programId)
                .setWorkoutId(myProgressDTO.workoutId)
                .setExerciseId(myProgressDTO.exerciseId)
                .setExerciseLevelId(myProgressDTO.exerciseLevelId)
                .build()

            // Perform any necessary validation or business logic before creating
            const userPromise = this.userRepo.findById(myProgressDTO.userId)
            const workoutPromise = this.workokutRepo.findById(
                myProgressDTO.workoutId
            )

            const exerciseLevelPromise = this.exerciseLvlRepo.findById(myProgressDTO.exerciseLevelId)

            const [user, workout, exericseLevel] = await Promise.all([userPromise, workoutPromise, exerciseLevelPromise])

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

            if (errors.length > 0) {
                throw new ValidationException(errors)
            }

            const createdMyProgress = await this.myProgressRepository.create(
                myProgress
            )

            return createdMyProgress
        } catch (error: any) {
            // Handle any errors that occurred during the process
            this.logger.error(error.message)
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
