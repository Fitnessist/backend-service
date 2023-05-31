import type Exercise from "../entity/Exercise"

export interface IExerciseRepository {
    findById: (id: string) => Promise<Exercise | null>
    findByWorkoutId: (workoutId: string) => Promise<Exercise[] | null>
    create: (workout: Exercise) => Promise<Exercise | null>
}
