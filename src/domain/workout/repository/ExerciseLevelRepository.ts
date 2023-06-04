import type ExerciseLevel from "../entity/ExerciseLevel"

export interface IExerciseLevelRepository {
    findById: (id: string) => Promise<ExerciseLevel | null>
}
