import { NotFoundException } from "@common/exceptions/NotFoundException"
import type Workout from "@domain/workout/entity/Workout"
import { type IWorkoutRepository } from "@domain/workout/repository/IWorkoutRepository"
import { type Logger } from "@infrastructure/log/Logger"
import {
    type IPagination,
    createPaginatedResponse
} from "@helpers/PaginationHelper"

export default class WorkoutUseCase {
    private readonly workoutRepository: IWorkoutRepository
    private readonly logger: Logger

    constructor (logger: Logger, workoutRepository: IWorkoutRepository) {
        this.logger = logger
        this.workoutRepository = workoutRepository
    }

    async findWorkoutById (workoutId: string): Promise<Workout | null> {
        // Panggil method findById pada workoutRepository
        const workout = await this.workoutRepository.findById(workoutId)

        if (workout === null) {
            throw new NotFoundException()
        }
        return workout
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
