import { type MyProgram } from "../entity/MyProgram"
import UserResponseDTO from "@domain/user/entity/UserResponseDTO"
import ProgramResponseDTO from "@domain/workout/dto/ProgramResponseDTO"

export class MyProgramResponseDTO {
    public id: string
    public user_id: string
    public program_id: string
    public exercise_completed_counter?: number
    public workout_completed_counter?: number
    public total_workouts?: number
    public total_exercises?: number
    public progress_percent?: number
    public user?: UserResponseDTO
    public program?: ProgramResponseDTO
    public updated_at?: string

    constructor (payload: MyProgram) {
        this.id = payload.id
        this.user_id = payload.userId
        this.program_id = payload.programId
        this.exercise_completed_counter = payload.exerciseCompletedCounter
        this.workout_completed_counter = payload.workoutCompletedCounter
        this.total_exercises = payload.totalExercises
        this.total_workouts = payload.totalWorkouts
        this.progress_percent = payload.progressPercent
        this.program = payload.program !== undefined ? new ProgramResponseDTO(payload.program) : undefined
        this.user = payload.user !== undefined ? new UserResponseDTO(payload.user) : undefined
    }
}
