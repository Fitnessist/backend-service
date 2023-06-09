import type Workout from "../entity/Workout"

export interface IWorkoutRepository {
    findById: (id: string) => Promise<Workout | null>
    create: (programID: string, workout: Workout) => Promise<Workout>
    getAll: (programId: string, limit: number, offset: number) => Promise<Workout[]>
    countTotalItems: () => Promise<number>
}
