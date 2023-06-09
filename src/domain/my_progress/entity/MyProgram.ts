import { type User } from "@domain/user/entity/User"
import type Program from "@domain/workout/entity/Program"

export class MyProgram {
    public id: string
    public userId: string
    public programId: string
    public exerciseCompletedCounter?: number
    public workoutCompletedCounter?: number
    public totalWorkouts?: number
    public totalExercises?: number
    public progressPercent?: number
    public user?: User
    public program?: Program
    public created_at?: Date
    public updated_at?: Date

    constructor (id: string, userId: string, programId: string, exerciseCompletedCounter: number = 0, workoutCompletedCounter?: number) {
        this.id = id
        this.userId = userId
        this.programId = programId
        this.exerciseCompletedCounter = exerciseCompletedCounter
        this.workoutCompletedCounter = workoutCompletedCounter
    }
}
