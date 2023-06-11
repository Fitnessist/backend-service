import { type User } from "@domain/user/entity/User"
import type Exercise from "@domain/workout/entity/Exercise"
import type ExerciseLevel from "@domain/workout/entity/ExerciseLevel"
import type Program from "@domain/workout/entity/Program"
import type Workout from "@domain/workout/entity/Workout"

export class MyExerciseProgress {
    public id: string
    public userId: string
    public programId: string
    public workoutId: string
    public exerciseId: string
    public exerciseLevelId: string
    public user?: User
    public program?: Program
    public workout?: Workout
    public exercise?: Exercise
    public exerciseLevel?: ExerciseLevel

    constructor (payload: {
        id: string
        userId: string
        programId: string
        workoutId: string
        exerciseId: string
        exerciseLevelId: string
        user?: User
        program?: Program
        workout?: Workout
        exercise?: Exercise
        exerciseLevel?: ExerciseLevel
    }) {
        this.id = payload.id
        this.userId = payload.userId
        this.programId = payload.programId
        this.workoutId = payload.workoutId
        this.exerciseId = payload.exerciseId
        this.exerciseLevelId = payload.exerciseLevelId
    }
}
