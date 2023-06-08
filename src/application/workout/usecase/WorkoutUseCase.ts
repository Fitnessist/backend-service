import { NotFoundException } from "@common/exceptions/NotFoundException"
import { type IWorkoutRepository } from "@domain/workout/repository/IWorkoutRepository"
import { type Logger } from "@infrastructure/log/Logger"
import {
    type IPagination,
    createPaginatedResponse
} from "@helpers/PaginationHelper"
import { type IExerciseRepository } from "@domain/workout/repository/IExerciseRepository"
import type Exercise from "@domain/workout/entity/Exercise"
import WorkoutResponseDTO from "@domain/workout/dto/WorkoutResponseDTO"

export default class WorkoutUseCase {
    private readonly workoutRepository: IWorkoutRepository
    private readonly logger: Logger
    private readonly exerciseRepo: IExerciseRepository

    constructor (logger: Logger, workoutRepository: IWorkoutRepository, exerciseRepo: IExerciseRepository) {
        this.logger = logger
        this.workoutRepository = workoutRepository
        this.exerciseRepo = exerciseRepo
    }

    async findWorkoutById (workoutId: string): Promise<WorkoutResponseDTO | null> {
        // Panggil method findById pada workoutRepository
        const workoutPomise = this.workoutRepository.findById(workoutId)
        const exercisePromise = this.exerciseRepo.findByWorkoutId(workoutId)

        const [workout, exercises] = await Promise.all([workoutPomise, exercisePromise])

        if (workout === null) {
            throw new NotFoundException()
        }
        workout.exercises = exercises as Exercise[]
        const workoutResponse = new WorkoutResponseDTO(workout)
        return workoutResponse
    }

    async getAllWorkouts (
        programId: string = "",
        pageNumber: number = 1,
        pageSize: number = 10
    ): Promise<IPagination> {
        const offset = (pageNumber - 1) * pageSize
        const baseUrl = process.env.APP_HOST ?? "http://localhost"

        try {
            const totalWorkoutromise =
                await this.workoutRepository.countTotalItems()
            const workoutsPromise = await this.workoutRepository.getAll(
                programId,
                pageSize,
                offset
            )

            const [totalWorkout, workouts] = await Promise.all([
                totalWorkoutromise,
                workoutsPromise
            ])

            const dataS = workouts.map((program) => {
                return {
                    ...program,
                    links: {
                        self: `${baseUrl}/api/v1/workouts/${program.id}`
                    }
                }
            })
            const response = createPaginatedResponse(
                dataS,
                totalWorkout,
                pageNumber,
                pageSize,
                baseUrl
            )
            return response
        } catch (error: any) {
            this.logger.error(error?.message)
            throw error
        }
    }
}
