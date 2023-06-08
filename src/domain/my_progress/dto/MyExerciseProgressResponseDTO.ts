import { type User } from "@domain/user/entity/User"
import type Program from "@domain/workout/entity/Program"
import type Workout from "@domain/workout/entity/Workout"
import { type MyExerciseProgress } from "../entity/MyExerciseProgress"
import ExerciseResponseDTO from "@domain/workout/dto/ExerciseResponseDTO"
import ExerciseLevelResponseDTO from "@domain/workout/dto/ExerciseLevelResponseDTO"

export class MyExerciseProgressResponseDTO {
    public user_id: string
    public user?: User | null
    public program_id: string
    public program: Program | null
    public workout_id: string
    public workout?: Workout | null
    public exercise_id: string
    public exercise?: ExerciseResponseDTO | null
    public exercise_level_id: string
    public exercise_levels?: ExerciseLevelResponseDTO | null

    constructor (payload: MyExerciseProgress) {
        this.user_id = payload.userId
        this.program_id = payload.programId
        this.workout_id = payload.workoutId
        this.exercise_id = payload.exerciseId
        this.exercise_level_id = payload.exerciseLevelId
        this.program = payload.program
        this.user = payload.user
        this.workout = payload.workout
        this.exercise = payload.exercise !== null ? new ExerciseResponseDTO(payload.exercise) : undefined
        this.exercise_levels = payload.exerciseLevel !== null ? new ExerciseLevelResponseDTO(payload.exerciseLevel) : undefined
    }
}
