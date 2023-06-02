import { type MyExerciseProgress } from "../entity/MyExerciseProgress"

export interface MyProgressRepository {
    findByUserId: (userId: string) => Promise<MyExerciseProgress[] | null>
    findWithCondition: (payload: {
        programId?: string
        workoutId?: string
        exerciseId?: string
        exerciseLevelId?: string
    }) => Promise<MyExerciseProgress | null>
    create: (myProgress: MyExerciseProgress) => Promise<MyExerciseProgress>
    update: (myProgress: MyExerciseProgress) => Promise<MyExerciseProgress>
}
