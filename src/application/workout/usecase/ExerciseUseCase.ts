import { type IExerciseRepository } from "@domain/workout/repository/IExerciseRepository"
import type Exercise from "@domain/workout/entity/Exercise"
import { NotFoundException } from "@common/exceptions/NotFoundException"

export default class ExerciseUseCase {
    private readonly exerciseRepository: IExerciseRepository

    constructor (exerciseRepository: IExerciseRepository) {
        this.exerciseRepository = exerciseRepository
    }

    async findByWorkoutId (workoutId: string): Promise<Exercise[]> {
        // const offset = (page - 1) * perPage;
        const exercises = await this.exerciseRepository.findByWorkoutId(workoutId)

        if (exercises == null) {
            throw new NotFoundException()
        }

        return exercises
    }

    async findById (id: string): Promise<Exercise> {
        const exercise = await this.exerciseRepository.findById(id)

        if (exercise == null) {
            throw new NotFoundException()
        }

        return exercise
    }
}
